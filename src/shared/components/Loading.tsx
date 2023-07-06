import React from "react";

interface LoadingProps {
  fullWidth?: boolean;
}
const Loading = (props: LoadingProps) => {
  return (
    <div className={props.fullWidth ? "loader full-width-loader" : "loader"}>
      <div className="lds-ring">
        <span className="loader"></span>
      </div>
    </div>
  );
};

export const LoadingEllipsis = (props: LoadingProps) => {
  return (
    <div className={props.fullWidth ? "loader full-width-loader" : "loader"}>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
