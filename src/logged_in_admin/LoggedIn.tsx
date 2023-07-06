import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Modal from "../shared/components/Modal";
import DIALOG_NAMES from "./dialogs/Dialogs";
import Drawer from "./nagivation/Drawer";
import NavBar from "./nagivation/NavBar";
import Loading from "../shared/components/Loading";
import { useAppContext } from "../shared/functions/Context";

interface IProps {
  fetchingData: boolean;
}
const MainLayout = (props: IProps) => {
  const { fetchingData } = props;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === "/c") navigate("/dashboard");
  }, [navigate, pathname]);

  return (
    <div>
      <div className="responsive-drawer">
        <Drawer />
        <main className="content">
          <NavBar />
          {!fetchingData && <Outlet />}
          {fetchingData && <Loading />}
        </main>
      </div>
   
    </div>
  );
};

const LoggedIn = observer(() => {
  const { api } = useAppContext();
  const [fetchingData, setFetchingData] = useState(true);
  const firstUpdate = useRef(true);

  useEffect(() => {
    const loadData = async () => {
      if (firstUpdate.current) {
        setFetchingData(true);
        try {
          await api.settings.getSettings();
        } catch (error) {
          setFetchingData(false);
        }
        setFetchingData(false);
        firstUpdate.current = false;
      }
    };
    loadData();
  }, [api.settings]);

  return (
    <div>
      <MainLayout fetchingData={fetchingData} />
    </div>
  );
});

export default LoggedIn;
