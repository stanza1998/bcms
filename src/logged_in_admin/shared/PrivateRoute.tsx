import { observer } from "mobx-react-lite";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../shared/functions/Context";

const PrivateRoute = observer((props: any) => {
  const { children } = props;
  const { store } = useAppContext();
  const { pathname } = useLocation();

  // const state = { pathname: "/", from: pathname };

  // return store.user.me ? children : <Navigate to={state} />;
  const state = { from: pathname };

  return store.user.me ? children : <Navigate to="/" state={state} />;
});

export default PrivateRoute;
