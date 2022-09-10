import { HashtagMatcher } from "./matchers/HashtagMatcher";
import { MDBoldMatcher } from "./matchers/markdown/MDBoldMatcher";
import { MDCodeMatcher } from "./matchers/markdown/MDCodeMatcher";
import { MDQuoteMatcher } from "./matchers/markdown/MDQuoteMatcher";
import { MDStrikeMatcher } from "./matchers/markdown/MDStrikeMatcher";
import { MDItalicMatcher } from "./matchers/markdown/MDItalicMatcher";
import { MentionMatcher } from "./matchers/MentionMatcher";
import { SpoilerMatcher } from "./matchers/SpoilerMatcher";
import trimify from "../../utils/trimify";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import React from "react";

const Markup = ({ children }) => {
  return (
    <Interweave
      content={trimify(children)}
      escapeHtml
      allowList={["b", "i", "a", "br", "code", "span"]}
      newWindow
      onClick={(event) => event.stopPropagation()}
      matchers={[
        new HashtagMatcher("hashtag"),
        new MentionMatcher("mention"),
        new MDBoldMatcher("mdBold"),
        new MDItalicMatcher("mdItalic"),
        new MDStrikeMatcher("mdStrike"),
        new MDQuoteMatcher("mdQuote"),
        new MDCodeMatcher("mdCode"),
        new SpoilerMatcher("spoiler"),
        new UrlMatcher("url", { validateTLD: false }),
      ]}
    />
  );
};

export default Markup;
