import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";

const Main = observer(() => {
  const navigate = useNavigate();

  const signUp = () => {
    navigate("/sign-up");
  };

  const signIn = () => {
    navigate("/sign-in");
  };

  



  return (
    <div>
      <div className="uk-section">
        <div className="uk-container">
          <button
            className="uk-button uk-button-secondary uk-margin-right"
            onClick={signUp}
          >
            Register your Company
          </button>
          <button className="uk-button uk-button-secondary" onClick={signIn}>
            Already have an account
          </button>
        </div>
      </div>
    </div>
  );
});

export default Main;
