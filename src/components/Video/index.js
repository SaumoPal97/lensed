import "plyr-react/plyr.css";

import Plyr from "plyr-react";
import React from "react";

const Video = ({ src }) => {
  return (
    <div className="rounded-lg">
      <Plyr
        source={{
          type: "video",
          sources: [{ src, provider: "html5" }],
          poster: src,
        }}
        options={{
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "fullscreen",
          ],
          ratio: "16:12",
        }}
      />
    </div>
  );
};

export default Video;
