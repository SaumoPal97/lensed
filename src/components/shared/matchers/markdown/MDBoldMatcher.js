import { Matcher } from "interweave";
import React from "react";

export class MDBoldMatcher extends Matcher {
  replaceWith(children) {
    return <b>{children}</b>;
  }

  asTag() {
    return "b";
  }

  match(value) {
    return this.doMatch(value, /\*\*(.*?)\*\*/u, (matches) => ({
      match: matches[1],
    }));
  }
}
