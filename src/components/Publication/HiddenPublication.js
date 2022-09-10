import { Card } from "../Card";
import React from "react";

const HiddenPublication = ({ type }) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="py-3 px-4 text-sm italic">
        {type} was hidden by the author
      </div>
    </Card>
  );
};

export default HiddenPublication;
