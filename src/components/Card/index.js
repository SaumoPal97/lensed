import clsx from "clsx";

export const Card = ({ children, className = "", forceRounded = false }) => {
  return (
    <div
      className={clsx(
        forceRounded ? "rounded-xl" : "rounded-none sm:rounded-xl",
        "border dark:border-gray-700/80 bg-white dark:bg-gray-900",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => {
  return <div className={`border-b p-3 ${className}`}>{children}</div>;
};

export const CardBody = ({ children, className = "" }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};
