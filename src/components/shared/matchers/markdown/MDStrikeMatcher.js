import { Matcher } from "interweave";
import React from "react";

export class MDStrikeMatcher extends Matcher {
  replaceWith(children) {
    return <s>{children}</s>;
  }

  asTag() {
    return "s";
  }

  match(value) {
    return this.doMatch(value, /~~(.*?)~~/u, (matches) => ({
      match: matches[1],
    }));
  }
}
