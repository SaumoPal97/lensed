import React from "react";
import { useHistory } from "react-router-dom";

function LeftSidebar() {
  const history = useHistory();

  return (
    <div className="flex flex-col h-screen w-1/6">
      <div
        className="text-xl font-semibold text-primary mt-5 mr-5 mb-2 cursor-pointer"
        onClick={() => history.push("/")}
      >
        Questions
      </div>
      <div className="text-xl font-semibold text-primary mr-5 mb-2 cursor-pointer">
        Tags
      </div>
      <div className="text-xl font-semibold text-primary mr-5 mb-2 cursor-pointer">
        Users
      </div>
      <div className="text-xl font-semibold text-primary mr-5 mb-2 cursor-pointer">
        Communities
      </div>
      <span className="text-xs text-primary px-2 border border-tertiary bg-tertiary rounded-md w-fit">
        Coming Soon
      </span>
    </div>
  );
}

export default LeftSidebar;
