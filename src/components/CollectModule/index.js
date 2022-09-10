import React, { useEffect, useState } from "react";
import {
  client,
  allowanceSettingsQuery,
  generateAllowanceQuery,
  createCollectProxyAction,
  createCollectTypedData,
  hasTransactionBeenIndexed,
} from "../../services/api/instance";
import { getModule } from "./getModule";
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { useHistory } from "react-router-dom";
import { signedTypeData, splitSignature } from "../../utils/ethers-service";
import { lensHub } from "../../utils/lenshub";
import Cookies from "js-cookie";
import axios from "axios";

function CollectModule({ pub }) {
  const [allowed, setAllowed] = useState(true);
  const [allowanceData, setAllowanceData] = useState(null);
  const history = useHistory();
  const [posting, setPosting] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const { address } = useAccount();

  const { config } = usePrepareSendTransaction({
    request: {},
  });

  const {
    data: txData,
    isLoading: transactionLoading,
    sendTransaction,
  } = useSendTransaction({
    ...config,
    mode: "recklesslyUnprepared",
  });

  const getAllowancePayload = (currency) => {
    return {
      currencies: [currency],
      collectModules: [
        "LimitedFeeCollectModule",
        "FeeCollectModule",
        "LimitedTimedFeeCollectModule",
        "TimedFeeCollectModule",
        "FreeCollectModule",
        "RevertCollectModule",
      ],
      followModules: ["FeeFollowModule"],
      referenceModules: ["FollowerOnlyReferenceModule"],
    };
  };

  const allowanceSettingsCall = async () => {
    const res = await client
      .query(allowanceSettingsQuery, {
        request: getAllowancePayload(
          "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
        ),
      })
      .toPromise();

    setAllowed(
      res.data?.approvedModuleAllowanceAmount[0]?.allowance !== "0x00"
    );
    setAllowanceData(res.data);
  };

  const handleAllowance = async (currencies, value, selectedModule) => {
    const res = await client
      .query(generateAllowanceQuery, {
        request: {
          currency: currencies,
          value: value,
          [getModule(module.module).type]: selectedModule,
        },
      })
      .toPromise();

    const data = res?.data?.generateModuleCurrencyApprovalData;
    sendTransaction?.({
      recklesslySetUnpreparedRequest: {
        from: data?.from,
        to: data?.to,
        data: data?.data,
      },
    });
  };
  const { isLoading: waitLoading } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      setAllowed(!allowed);
    },
  });

  useEffect(() => {
    allowanceSettingsCall();
  }, []);

  const createCollect = async () => {
    const collectModule = pub?.collectModule;

    if (collectModule?.type === "FreeCollectModule") {
      await client.mutation(createCollectProxyAction, {
        request: {
          collect: { freeCollect: { publicationId: pub?.id } },
        },
      });
    } else {
      const res = await client
        .mutation(createCollectTypedData, {
          request: { publicationId: pub?.id },
        })
        .toPromise();
      console.log("saumo 123 typedData", res);

      const typedData = res.data.createCollectTypedData.typedData;
      const signature = await signedTypeData(
        typedData.domain,
        typedData.types,
        typedData.value
      );
      const {
        profileId,
        pubId,
        data: collectData,
        deadline,
      } = typedData?.value;

      const { v, r, s } = splitSignature(signature);
      const sig = { v, r, s, deadline };

      console.log("breaking??", {
        collector: address,
        profileId,
        pubId,
        data: collectData,
        sig,
      });
      const tx = await lensHub.collectWithSig({
        collector: address,
        profileId,
        pubId,
        data: collectData,
        sig,
      });

      await tx.wait();
      console.log("transaction hashes", tx);

      const checkTxnIndexed = setInterval(async () => {
        setPosting(false);
        setIndexing(true);

        console.log("check if indexed");

        const hastxnBeenIndexedRes = await axios.post(
          "https://api.lens.dev/",
          {
            query: hasTransactionBeenIndexed,
            variables: {
              request: { txHash: tx.hash },
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": Cookies.get("accessToken")
                ? `Bearer ${Cookies.get("accessToken")}`
                : "",
            },
          }
        );

        console.log("indexed? ", hastxnBeenIndexedRes);

        if (hastxnBeenIndexedRes.data.data.hasTxHashBeenIndexed.indexed) {
          setIndexing(false);
          clearInterval(checkTxnIndexed);
          history.go(0);
        }
      }, 5000);
      history.go(0);
    }
  };

  return (
    <div key={pub.id} className="mt-2">
      <div className="cursor-pointer border-l border-r border-b hover:bg-gray-100 hover:dark:bg-gray-300 p-5">
        <p>This answer is hidden, collect this NFT to reveal</p>
        {allowed ? (
          <button
            className="bg-tertiary px-2 py-1 rounded-md"
            onClick={createCollect}
          >
            Collect NFT{" "}
            {pub?.collectModule?.amount?.value
              ? `- ${pub?.collectModule?.amount?.value} ${pub?.collectModule?.amount?.asset?.symbol}`
              : null}{" "}
            {indexing || posting ? "Waiting...." : ""}
          </button>
        ) : (
          <button
            className="bg-tertiary px-2 py-1 rounded-md"
            onClick={() =>
              handleAllowance(
                allowanceData?.approvedModuleAllowanceAmount[0].currency,
                Number.MAX_SAFE_INTEGER.toString(),
                allowanceData?.approvedModuleAllowanceAmount[0].module
              )
            }
          >
            Allow Collect Module{" "}
            {transactionLoading || waitLoading ? "Loading..." : null}
          </button>
        )}
      </div>
    </div>
  );
}

export default CollectModule;
