import Attachments from "../Attachments";
import IFramely from "../IFramely";
import Markup from "../shared/Markup";
import { EyeIcon } from "@heroicons/react/outline";
import getURLs from "../../lib/getURLs";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import React from "react";
import RichTextEditor from "../RichTextEditor";

const PublicationBody = ({ publication }) => {
  const { pathname } = useLocation();
  const publicationType = publication?.metadata?.attributes[0]?.value;
  const showMore =
    publication?.metadata?.content?.length > 450 && pathname !== "/posts/[id]";

  return (
    <div className="break-words">
      <>
        <div
          className={clsx({
            "line-clamp-5": showMore,
          })}
        >
          <div className="whitespace-pre-wrap break-words leading-md linkify text-md">
            <RichTextEditor
              value={publication?.metadata?.content}
              readOnly={true}
            />
          </div>
        </div>
        {showMore && (
          <div className="mt-4 text-sm text-gray-500 font-bold flex items-center space-x-1">
            <EyeIcon className="h-4 w-4" />
            <span>Show more</span>
          </div>
        )}
      </>
      {publication?.metadata?.media?.length > 0 ? (
        <Attachments attachments={publication?.metadata?.media} />
      ) : (
        publication?.metadata?.content &&
        publicationType !== "crowdfund" &&
        publicationType !== "community" &&
        getURLs(publication?.metadata?.content)?.length > 0 && (
          <IFramely url={getURLs(publication?.metadata?.content)[0]} />
        )
      )}
    </div>
  );
};

export default PublicationBody;
