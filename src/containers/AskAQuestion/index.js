import React, { useState } from "react";
import Header from "../../components/Header";
import LeftSidebar from "../../components/LeftSidebar";
import RightSidebar from "../../components/RightSidebar";
import { WithContext as ReactTags } from "react-tag-input";
import {
  client,
  getDefaultProfile,
  postQuestion,
  getPublicationByProfileId,
  hasTransactionBeenIndexed,
} from "../../services/api/instance";
import "./style.css";
import { useAccount } from "wagmi";
import { pinataUpload } from "../../services/ipfs";
import { immediateToast } from "izitoast-react";
import "izitoast-react/dist/iziToast.css";
import { useHistory } from "react-router-dom";
import { signedTypeData, splitSignature } from "../../utils/ethers-service";
import { lensHub } from "../../utils/lenshub";
import { v4 as uuid } from "uuid";
import trimify from "../../utils/trimify";
import axios from "axios";
import Cookies from "js-cookie";
import RichTextEditor from "../../components/RichTextEditor";

function AskAQuestion() {
  const [tags, setTags] = useState([]);
  const [value, setValue] = useState("");
  const [posting, setPosting] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const history = useHistory();

  const suggestions = [
    { id: "solidity", text: "solidity" },
    { id: "web3", text: "web3" },
    { id: "rust", text: "rust" },
    { id: "ethers", text: "ethers" },
    { id: "lens", text: "lens" },
  ];

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const { address } = useAccount();

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = (index) => {
    console.log("The tag at index " + index + " was clicked");
  };

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
        name: `Post by @${profileResponse.data.defaultProfile?.handle}`,
        tags: [...tags.map((tag) => tag?.text), "lensed"],
        mainContentFocus: "TEXT_ONLY",
        contentWarning: null,
        media: [],
        locale: "en",
        createdOn: new Date(),
        appId: "LensEd",
        attributes: [
          {
            traitType: "string",
            key: "type",
            value: "post",
          },
        ],
      };

      const options = {
        pinataOptions: {
          cidVersion: 0,
        },
      };

      const uploadResponse = await pinataUpload(body, options);

      let createPostRequest = {
        profileId: profileResponse.data.defaultProfile.id,
        contentURI: `ipfs://${uploadResponse.data.IpfsHash}`,
        collectModule: {
          revertCollectModule: true,
        },
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      };

      const postOnLens = await client
        .mutation(postQuestion, { request: createPostRequest })
        .toPromise();

      const typedData = postOnLens.data.createPostTypedData.typedData;
      const signature = await signedTypeData(
        typedData.domain,
        typedData.types,
        typedData.value
      );
      const { v, r, s } = splitSignature(signature);
      const tx = await lensHub.postWithSig({
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
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
          // history.push(`/posts/`);
          const getMyPubications = await client
            .query(getPublicationByProfileId, {
              profileId: profileResponse.data.defaultProfile.id,
            })
            .toPromise();

          history.push(
            `/posts/${getMyPubications.data.publications.items[0].id}`
          );
        }
      }, 5000);
    } else {
      immediateToast("error", {
        message: "No text is added",
        position: "topRight",
      });
    }
  };

  return (
    <div>
      <Header />
      <div className="flex flex-row h-max">
        <LeftSidebar />
        <div className="w-1/2">
          <div className="flex flex-row pb-2"></div>
          <div className="text-3xl font-bold flex flex-row justify-center lign-center">
            Ask a public question
          </div>
          <div className="my-2 mx-5 flex flex-col justify-center align-center">
            <p>
              You’re ready to ask your first question and the community is here
              to help! To get you the best answers, we’ve provided some
              guidance:
            </p>
            <ul className="py-4 font-medium list-disc">
              <li>
                Before you post, search the site to make sure your question
                hasn’t been answered.
              </li>
              <li>Summarize the problem</li>
              <li>Describe what you’ve tried</li>
            </ul>
          </div>
          {/* <textarea
            className="w-full"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          /> */}
          <RichTextEditor value={value} setValue={setValue} />
          <div className="tags mt-4">
            <div className="font-medium text-xl mb-2">
              Add relevant tags (upto 3)
            </div>
            <ReactTags
              tags={tags}
              suggestions={suggestions}
              delimiters={delimiters}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              handleDrag={handleDrag}
              handleTagClick={handleTagClick}
              inputFieldPosition="bottom"
              autocomplete
            />
          </div>
          <button
            className="bg-tertiary px-2 py-1 mt-5 rounded-md"
            onClick={postAnswer}
          >
            Post Question
          </button>
          {indexing ? <p>Indexing....</p> : null}
          {posting ? <p>Uploading....</p> : null}
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}

export default AskAQuestion;
