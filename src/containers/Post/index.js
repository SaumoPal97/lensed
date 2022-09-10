import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  client,
  getPublicationById,
  getCommentsByPublicationId,
  getDefaultProfile,
  commentAnswer,
  hasTransactionBeenIndexed,
  enabledCurrencies,
} from "../../services/api/instance";
import Header from "../../components/Header";
import LeftSidebar from "../../components/LeftSidebar";
import RightSidebar from "../../components/RightSidebar";
import Publication from "../../components/Publication";
import RichTextEditor from "../../components/RichTextEditor";
import { useHistory } from "react-router-dom";
import { useAccount } from "wagmi";
import { signedTypeData, splitSignature } from "../../utils/ethers-service";
import { lensHub } from "../../utils/lenshub";
import { v4 as uuid } from "uuid";
import trimify from "../../utils/trimify";
import axios from "axios";
import Cookies from "js-cookie";
import { immediateToast } from "izitoast-react";
import { pinataUpload } from "../../services/ipfs";
import CollectModule from "../../components/CollectModule";

function Post() {
  const { id } = useParams();
  const [value, setValue] = useState("");
  const [posting, setPosting] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const history = useHistory();

  const [publication, setPublication] = useState(null);
  const [comments, setComments] = useState([]);
  const [allowed, setAllowed] = useState(false);

  const { address } = useAccount();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchPublication() {
    try {
      const response = await client
        .query(getPublicationById, { publicationId: id })
        .toPromise();

      setPublication(response.data.publications.items[0]);
    } catch (e) {
      console.log({ e });
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchComments() {
    try {
      const response = await client
        .query(getCommentsByPublicationId, { publicationId: id })
        .toPromise();
      setComments(response.data.publications.items);
    } catch (e) {
      console.log({ e });
    }
  }

  useEffect(() => {
    if (id) {
      fetchPublication();
      fetchComments();
    }
  }, [fetchComments, fetchPublication, id]);

  const fetchEnabledCurrencies = async () => {
    const response = await client.query(enabledCurrencies).toPromise();
    setCurrencyData(response.data);
  };
  useEffect(() => {
    fetchEnabledCurrencies();
  }, []);

  const postAnswer = async () => {
    if (value) {
      setPosting(true);
      const profileResponse = await client
        .query(getDefaultProfile, {
          ethereumAddress: address,
        })
        .toPromise();

      const body = {
        version: "2.0.0",
        metadata_id: uuid(),
        description: trimify(value),
        content: trimify(value),
        external_url: `https://lenster.xyz/u/${profileResponse.data.defaultProfile?.handle}`,
        image: null,
        imageMimeType: null,
        name: `Comment by @${profileResponse.data.defaultProfile?.handle}`,
        mainContentFocus: "TEXT_ONLY",
        contentWarning: null,
        media: [],
        locale: "en",
        createdOn: new Date(),
        appId: "LensEd",
      };

      const options = {
        pinataOptions: {
          cidVersion: 0,
        },
      };

      const uploadResponse = await pinataUpload(body, options);

      let createCommentRequest;
      if (fee) {
        createCommentRequest = {
          profileId: profileResponse.data.defaultProfile.id,
          publicationId: id,
          contentURI: `ipfs://${uploadResponse.data.IpfsHash}`,
          collectModule: {
            feeCollectModule: {
              amount: {
                currency: selectedCurrency,
                value: `${fee}`,
              },
              recipient: address,
              referralFee: 0,
              followerOnly: false,
            },
          },
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        };
      } else {
        createCommentRequest = {
          profileId: profileResponse.data.defaultProfile.id,
          publicationId: id,
          contentURI: `ipfs://${uploadResponse.data.IpfsHash}`,
          collectModule: {
            freeCollectModule: {
              followerOnly: false,
            },
          },
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        };
      }

      const postOnLens = await client
        .mutation(commentAnswer, { request: createCommentRequest })
        .toPromise();

      const typedData = postOnLens.data.createCommentTypedData.typedData;
      const signature = await signedTypeData(
        typedData.domain,
        typedData.types,
        typedData.value
      );
      const { v, r, s } = splitSignature(signature);
      const tx = await lensHub.commentWithSig({
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        profileIdPointed: typedData.value.profileIdPointed,
        pubIdPointed: typedData.value.pubIdPointed,
        referenceModuleData: typedData.value.referenceModuleData,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
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
    } else {
      immediateToast("error", {
        message: "No text is added",
        position: "topRight",
      });
    }
  };

  const [currencyData, setCurrencyData] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(
    "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
  );

  const [fee, setFee] = useState(0);

  return (
    <div>
      <Header />
      <div className="flex flex-row h-max">
        <LeftSidebar />
        <div className="w-1/2">
          <div className="flex flex-row pb-2"></div>
          <div>
            <div>
              <Publication publication={publication} />
              <div className="mt-5">
                <span className="text-xl font-bold">Comments</span>
                <RichTextEditor value={value} setValue={setValue} />
                <div className="mt-5 border border-primary p-4 rounded-md">
                  <p className="text-md font-bold">Add a fee</p>
                  <select
                    onChange={(e) => {
                      const currency = e.target.value.split("-");
                      setSelectedCurrency(currency[0]);
                    }}
                  >
                    {currencyData?.enabledModuleCurrencies?.map((currency) => (
                      <option
                        key={currency.address}
                        value={`${currency.address}-${currency.symbol}`}
                      >
                        {currency.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="px-2 py-1"
                    step="0.0001"
                    min="0"
                    max="100000"
                    type="number"
                    placeholder="5"
                    onChange={(e) => setFee(e.target.value)}
                  />
                </div>
                <button
                  className="bg-tertiary px-2 py-1 mt-5 rounded-md"
                  onClick={postAnswer}
                >
                  Post Answer
                </button>
                {indexing ? <p>Indexing....</p> : null}
                {posting ? <p>Uploading....</p> : null}
                {comments.map((pub) =>
                  pub.collectModule.type === "RevertCollectModule" ||
                  pub.hasCollectedByMe ? (
                    <div key={pub.id} className="mt-2">
                      <Publication publication={pub} allowClick={false} />
                    </div>
                  ) : (
                    <CollectModule pub={pub} />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}

export default Post;
