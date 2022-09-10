import imagekitURL from "../../lib/imagekitURL";
import axios from "axios";
import React, { useEffect, useState } from "react";

import Embed from "./Embed";
import Player from "./Player";

const IFramely = ({ url }) => {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (url) {
      axios(
        `https://iframe.ly/api/iframely?api_key=258c8580bd477c9b886b49&url=${url}`,
        { method: "GET" }
      )
        .then(({ data }) => {
          setIsLoaded(true);
          if (data) {
            setData(data);
          } else {
            setError(true);
          }
        })
        .catch(() => {
          setIsLoaded(true);
          setError(true);
        });
    } else {
      setError(true);
    }
  }, [url]);

  useEffect(() => {
    window.iframely && window.iframely.load();
  }, []);

  if (error || !isLoaded) {
    return null;
  } else {
    const og = {
      title: data?.meta?.title,
      description: data?.meta?.description,
      site: data?.meta?.site,
      url: data?.url,
      favicon: `https://www.google.com/s2/favicons?domain=${url}`,
      thumbnail:
        data?.links?.thumbnail &&
        imagekitURL(data?.links?.thumbnail[0]?.href, "attachment"),
      isSquare:
        data?.links?.thumbnail &&
        data?.links?.thumbnail[0]?.media?.width ===
          data?.links?.thumbnail[0]?.media?.height,
      html: data?.links?.player ? data?.links?.player[0]?.html : null,
    };

    if (!og.title) return null;

    return og.html ? <Player og={og} /> : <Embed og={og} />;
  }
};

export default IFramely;
