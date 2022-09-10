import React from "react";

function RightSidebar() {
  const tagsArray = ["solidity", "rust", "web3", "polygon", "lens", "react"];
  return (
    <div className="flex flex-col h-screen w-1/3">
      <div className="text-xl font-semibold text-primary mt-5 ml-5 mb-2">
        Explore Tags
      </div>
      <div className="flex flex-row flex-wrap ml-5">
        {tagsArray.map((tag, id) => (
          <span
            key={id}
            className="text-xs text-primary px-2 mb-1 mr-1 border border-tertiary bg-tertiary rounded-md w-fit"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default RightSidebar;
