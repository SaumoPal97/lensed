import clsx from "clsx";
import React from "react";

const Slug = ({ slug, prefix, className = "" }) => {
  return (
    <span
      className={clsx(
        "text-transparent bg-clip-text bg-gradient-to-r from-brand-600 dark:from-brand-400 to-pink-600 dark:to-pink-400 text-xs sm:text-sm",
        className
      )}
    >
      {prefix}
      {slug}
    </span>
  );
};

export default Slug;
