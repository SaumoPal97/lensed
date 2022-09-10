import getAvatar from "../../lib/getAvatar";
import clsx from "clsx";
import React from "react";

import Slug from "../shared/Slug";

function UserProfile({
  profile,
  showBio = false,
  showFollow = false,
  followStatusLoading = false,
  isFollowing = false,
  isBig = false,
}) {
  return (
    <div className="flex justify-between items-center">
      <a href={`/u/${profile?.handle}`}>
        <div className="flex items-center space-x-3">
          <img
            src={getAvatar(profile)}
            loading="lazy"
            className={clsx(
              isBig ? "w-14 h-14" : "w-10 h-10",
              "bg-gray-200 rounded-full border dark:border-gray-700/80"
            )}
            height={isBig ? 56 : 40}
            width={isBig ? 56 : 40}
            alt={profile?.handle}
          />
          <div>
            <div className="flex gap-1 items-center max-w-sm truncate">
              <div className={clsx(isBig ? "font-bold" : "text-md")}>
                {profile?.name ?? profile?.handle}
              </div>
            </div>
            <Slug className="text-sm" slug={profile?.handle} prefix="@" />
          </div>
        </div>
      </a>
    </div>
  );
}

export default UserProfile;
