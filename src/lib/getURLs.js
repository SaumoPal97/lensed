const getURLs = (text) => {
  const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return text.match(urlRegex) ?? [];
};

export default getURLs;
