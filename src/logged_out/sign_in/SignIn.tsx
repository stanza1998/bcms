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
  const [passwordType, setPasswordType] = useState("password");

  const [signInForm, setSignInForm] = useState({ email: "", password: "" });

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const forgotPassword = () => {
    showModalFromId(PASSWORD.FORGOT_PASSWORD_DIALOG);
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

  // useEffect(() => {
  //   return () => {
  //     // Cleanup function: reset the form when the component unmounts
  //     setSignInForm({ email: "", password: "" });
  //   };
  // }, []);
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
                <label htmlFor="username">Username:</label>
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SignIn;

{
  /* <input
className="uk-input"
id="user-login-email"
type="email"
placeholder="Email"
value={signInForm.email}
onChange={(e) =>
  setSignInForm({ ...signInForm, email: e.target.value })
}
required
/> */
}

{
  /* <input
className="uk-input"
id="user-login-password"
type={passwordType}
placeholder="Password"
value={signInForm.password}
onChange={(e) =>
  setSignInForm({ ...signInForm, password: e.target.value })
}
required
/> */
}
