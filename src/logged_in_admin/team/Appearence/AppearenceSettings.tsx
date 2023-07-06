import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import ColorSettings from "./components/ColorSettings";
import LogoSettings from "./components/LogoSettings";
import "./styles/index.scss";

const AppearanceSettings = observer(() => {
    const { api } = useAppContext();

    useEffect(() => {
        api.settings.getSettings();
    }, [api.settings])

    return (
        <div className="appearence">
            <h3><b>Appearence</b></h3>
            <div className="top">
                {/* <div className="app-colors">
                    <ColorSettings />
                </div> */}
                <div className="logo">
                    <LogoSettings />
                </div>
            </div>
            <div className="bottom">
            </div>
        </div>
    );
});


export default AppearanceSettings;