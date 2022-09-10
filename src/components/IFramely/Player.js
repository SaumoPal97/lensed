import React from "react";

const Player = ({ og }) => {
  return (
    <div className="mt-4 w-5/6 text-sm">
      <div
        className="iframely-player"
        dangerouslySetInnerHTML={{ __html: og.html }}
      />
    </div>
  );
};

export default Player;
