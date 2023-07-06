import React from "react";
import "./NoData.scss";
const NoData = () => {
  return (
    <div className="no-measures">
      <p className="uk-text-center">
        Empty (no records) <span>😔</span>
      </p>
    </div>
  );
};

export default NoData;
