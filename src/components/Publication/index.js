import UserProfile from "../UserProfile";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import HiddenPublication from "./HiddenPublication";
import PublicationBody from "./PublicationBody";
dayjs.extend(relativeTime);

function Publication({
  publication,
  showType = true,
  showActions = true,
  allowClick = true,
}) {
  const publicationType = publication?.metadata?.attributes[0]?.value;
  const isMirror = publication?.__typename === "Mirror";
  const profile = isMirror
    ? publication?.mirrorOf?.profile
    : publication?.profile;
  const timestamp = isMirror
    ? publication?.mirrorOf?.createdAt
    : publication?.createdAt;

  return (
    <a
      href={` /posts/${publication?.id ?? publication?.pubId}`}
      onClick={(e) => {
        if (!allowClick) {
          e.preventDefault();
        }
      }}
    >
      <article className="cursor-pointer border-l border-r border-b hover:bg-gray-100 hover:dark:bg-gray-300 p-5">
        <div>
          <div className="flex justify-between pb-4 space-x-1.5">
            <UserProfile
              profile={
                publicationType === "community" &&
                !!publication?.collectedBy?.defaultProfile
                  ? publication?.collectedBy?.defaultProfile
                  : profile
              }
            />
            <span className="text-sm text-gray-500">
              {dayjs(new Date(timestamp)).fromNow()}
            </span>
          </div>
          <div className="ml-[53px]">
            {publication?.hidden ? (
              <HiddenPublication type={publication?.__typename} />
            ) : (
              <>
                <PublicationBody publication={publication} />
              </>
            )}
          </div>
        </div>
      </article>
    </a>
  );
}

export default Publication;
