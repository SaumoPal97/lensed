import getIPFSLink from "../utils/getIPFSLink";
import imagekitURL from "./imagekitURL";

const getAvatar = (profile) => {
  return imagekitURL(
    getIPFSLink(
      profile?.picture?.original?.url ??
        profile?.picture?.uri ??
        `https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
    ),
    "avatar"
  );
};

export default getAvatar;
