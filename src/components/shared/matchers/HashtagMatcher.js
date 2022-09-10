import { hashflags } from "../../../data/hashflags";
import { Matcher } from "interweave";
import React from "react";
import { STATIC_ASSETS } from "../../../constants";

export function Hashtag({ ...props }) {
  const hashflag = props.display.slice(1).toLowerCase();
  const hasHashflag = hashflags.hasOwnProperty(hashflag);

  return (
    <span className="inline-flex items-center space-x-1">
      <span>
        <a
          href={`/search?q=${props.display.slice(1)}&type=pubs&src=link_click`}
        >
          {props.display}
        </a>
      </span>
      {hasHashflag && (
        <img
          className="h-4 !mr-0.5"
          height={16}
          src={`${STATIC_ASSETS}/hashflags/${hashflags[hashflag]}.png`}
          alt={hashflag}
        />
      )}
    </span>
  );
}

export class HashtagMatcher extends Matcher {
  replaceWith(match, props) {
    return React.createElement(Hashtag, props, match);
  }

  asTag() {
    return "a";
  }

  match(value) {
    return this.doMatch(value, /\B#(\w+)/, (matches) => {
      return {
        display: matches[0],
      };
    });
  }
}
