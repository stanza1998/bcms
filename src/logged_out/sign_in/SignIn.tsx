import { FormEvent, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ErrorAlert } from "../../shared/components/alert/Alert";
import { useAppContext } from "../../shared/functions/Context";
import { LoadingEllipsis } from "../../shared/components/Loading";
import { observer } from "mobx-react-lite";
import showModalFromId from "../../shared/functions/ModalShow";
import { PASSWORD } from "../dialog/Dialogs";
import Modal from "../../shared/components/Modal";
import ForgotPasswordDialog from "../dialog/ForgotPasswordDialog";
import background from "../sign_in/assets/b.jpg";
import "./SignIn.scss";
import DIALOG_NAMES from "../../logged_in_admin/dialogs/Dialogs";
import { resetPassword } from "./ResetFuntion";
import { auth } from "../../shared/database/FirebaseConfig";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const Loader = () => {
  return (
    <div style={style}>
      <LoadingEllipsis />
    </div>
  );
};

type ILocationState = {
  from: string;
};

const SignIn = observer(() => {
  const { api, store } = useAppContext();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [userNotFoundError, setUserNotFoundError] = useState(false);
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [resetEmail, setResetEmail] = useState("");
  const [rloading, setRLoading] = useState(false);

  console.log(resetEmail)

  const onReset = () => {
    showModalFromId(PASSWORD.FORGOT_PASSWORD_DIALOG);
  };

  const sendResetLink = async (e: any) => {
    e.preventDefault();
  
    // Check if resetEmail is empty or undefined
    if (!resetEmail) {
      console.error('Error: Email address is empty or undefined');
      return;
    }
  
    try {
      setRLoading(true);
      await resetPassword(resetEmail, auth);
      setRLoading(false);
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  

  const onSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setUserNotFoundError(false);
    const { email, password = "" } = signInForm;

    const $user = await api.auth.signIn(email, password);

    if (!$user) {
      setUserNotFoundError(true);
      setLoading(false);
      return;
    }
  };
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (!store.user.loading && store.user.me) {
    const state = location.state as ILocationState;
    if (state) return <Navigate to={state.from} />;
    return <Navigate to="/c/dashboard" />;
  }

  if (store.user.loading) return <Loader />;

  return (
    <div className="login-la">
      <div className={`login-la ${imageLoaded ? "loaded" : ""}`}>
        {!imageLoaded && <div className="loader">loading</div>}
        <div className={`content ${imageLoaded ? "show" : ""}`}>
          <div className="container">
            <div className="left-side">
              {/* Replace the placeholder image with your actual property image */}
              <img
                src="https://source.unsplash.com/800x600/?property"
                alt="Property"
                onLoad={handleImageLoad}
              />
            </div>
            <div className="right-side">
              <h2>Sign In</h2>
              <p>
                {userNotFoundError && (
                  <span style={{ color: "red" }}>Wrong Email or Password</span>
                )}
              </p>
              <form onSubmit={onSignIn}>
                <label htmlFor="username">Email:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={signInForm.email}
                  onChange={(e) =>
                    setSignInForm({ ...signInForm, email: e.target.value })
                  }
                  required
                />

                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={signInForm.password}
                  onChange={(e) =>
                    setSignInForm({ ...signInForm, password: e.target.value })
                  }
                  required
                />

                <button type="submit">
                  Login
                  {loading && <div data-uk-spinner="ratio: .5"></div>}
                </button>
                <button
                  style={{ marginTop: "4px" }}
                  type="button"
                  onClick={onReset}
                >
                  Forgot Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal modalId={PASSWORD.FORGOT_PASSWORD_DIALOG}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          <h3>Forget Password</h3>
          <form onSubmit={sendResetLink}>
            <div>
              <label>Email Address</label>
            </div>
            <div className="uk-margin">
              <input
                className="uk-input"
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                required
                onChange={(e: any) => setResetEmail(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                className="uk-button"
                style={{ color: "#01aced" }}
              >
                Send
                {rloading && <span data-uk-spinner={"ration:.5"}></span>}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
});

export default SignIn;
