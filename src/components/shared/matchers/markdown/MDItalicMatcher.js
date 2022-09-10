import { Matcher } from "interweave";
import React from "react";

export class MDItalicMatcher extends Matcher {
  replaceWith(children) {
    return <i>{children}</i>;
  }

  asTag() {
    return "i";
  }

  match(value) {
    return this.doMatch(value, /\*(.*?)\*/u, (matches) => ({
      match: matches[1],
    }));
  }
}
