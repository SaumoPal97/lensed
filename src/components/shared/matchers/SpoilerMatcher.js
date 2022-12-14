import { Matcher } from "interweave";
import React from "react";

export class SpoilerMatcher extends Matcher {
  replaceWith(children) {
    return (
      <span className="text-black text-opacity-0 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-800 active:text-opacity-100 active:bg-gray-200 px-[2px] py-[1px] dark:active:bg-black active:dark:text-white">
        {children}
      </span>
    );
  }

  asTag() {
    return "span";
  }

  match(value) {
    return this.doMatch(value, /\|\|(.*?)\|\|/u, (matches) => ({
      match: matches[1],
    }));
  }
}
