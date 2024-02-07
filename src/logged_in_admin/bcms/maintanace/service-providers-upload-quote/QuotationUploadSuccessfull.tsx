import React from "react";
import "./QuoteSuccessPage.scss";

export const QuotationUploadSuccessfull = () => {
  return (
    <div className="quote-success">
      <body>
        <div className="card">
          <div style={divStyle}>
            <i className="checkmark">✓</i>
          </div>
          <h1>Success</h1>
          <p>
            The information you provided has been forwarded to the body
            corporate manager.
            <br />
            You are welcome to update your documents using the same link if you
            are uncertain about the content you uploaded before the end of the
            specified window period.
          </p>
        </div>
      </body>
    </div>
  );
};

const divStyle = {
  borderRadius: "200px",
  height: "200px",
  width: "200px",
  background: "#F8FAF5",
  margin: "0 auto",
};
