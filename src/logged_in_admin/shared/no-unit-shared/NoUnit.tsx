import React from "react";
import "./NoUnits.scss"

export const NoUnit = () => {
  return (
    <div className="no-units">
      <div className="no-unit-container">
        <h1 className="no-unit-message">
          You do not have a unit in this property
        </h1>
      </div>
    </div>
  );
};
