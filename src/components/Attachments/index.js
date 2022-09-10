import { XIcon } from "@heroicons/react/outline";
import getIPFSLink from "../../utils/getIPFSLink";
import imagekitURL from "../../lib/imagekitURL";
import clsx from "clsx";
import React from "react";
import Video from "../Video";

const getClass = (attachments) => {
  if (attachments === 1) {
    return {
      aspect: "",
      row: "grid-cols-1 grid-rows-1 w-2/3",
    };
  } else if (attachments === 2) {
    return {
      aspect: "aspect-w-16 aspect-h-12",
      row: "grid-cols-2 grid-rows-1",
    };
  } else if (attachments > 2) {
    return {
      aspect: "aspect-w-16 aspect-h-12",
      row: "grid-cols-2 grid-rows-2",
    };
  }
};

const Attachments = ({ attachments, setAttachments, isNew = false }) => {
  const removeAttachment = (attachment) => {
    const arr = attachments;
    setAttachments(
      arr.filter(function (ele) {
        return ele !== attachment;
      })
    );
  };

  const slicedAttachments = isNew
    ? attachments?.slice(0, 4)
    : attachments?.some((e) => e.original.mimeType === "video/mp4")
    ? attachments?.slice(0, 1)
    : attachments?.slice(0, 4);

  return slicedAttachments?.length !== 0 ? (
    <div
      className={clsx(
        getClass(slicedAttachments?.length)?.row,
        "grid grid-flow-col gap-2 pt-3"
      )}
      onClick={(event) => event.stopPropagation()}
    >
      {slicedAttachments?.map((attachment) => (
        <div
          className={clsx(
            (isNew ? attachment.type : attachment.original.mimeType) ===
              "video/mp4"
              ? ""
              : getClass(slicedAttachments?.length)?.aspect
          )}
          key={isNew ? attachment.item : getIPFSLink(attachment.original.url)}
        >
          {(isNew ? attachment.type : attachment.original.mimeType) ===
          "video/mp4" ? (
            <Video
              src={
                isNew ? attachment.item : getIPFSLink(attachment.original.url)
              }
            />
          ) : (
            <img
              className="object-cover bg-gray-100 rounded-lg border cursor-pointer dark:bg-gray-800 dark:border-gray-700/80"
              loading="lazy"
              onClick={() =>
                window.open(
                  isNew
                    ? attachment.item
                    : getIPFSLink(attachment.original.url),
                  "_blank"
                )
              }
              src={
                isNew
                  ? getIPFSLink(attachment.item)
                  : imagekitURL(
                      getIPFSLink(attachment.original.url),
                      "attachment"
                    )
              }
              alt={
                isNew
                  ? attachment.item
                  : imagekitURL(
                      getIPFSLink(attachment.original.url),
                      "attachment"
                    )
              }
            />
          )}
          {isNew && (
            <div className="m-3">
              <button
                type="button"
                className="p-1.5 bg-gray-900 rounded-full opacity-75"
                onClick={() => removeAttachment(attachment)}
              >
                <XIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  ) : null;
};

export default Attachments;
