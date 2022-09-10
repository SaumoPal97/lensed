import { IMAGEKIT_URL } from "../constants";

const imagekitURL = (url, name) => {
  return name
    ? `${IMAGEKIT_URL}/tr:n-${name},tr:di-placeholder.webp/${url}`
    : `${IMAGEKIT_URL}/tr:di-placeholder.webp/${url}`;
};

export default imagekitURL;
