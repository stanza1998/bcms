import { observer } from "mobx-react-lite";
import { ChangeEvent } from "react";
import { useAppContext } from "../../../../shared/functions/Context";

const LogoSettings = observer(() => {
    const { api, store } = useAppContext();
    const loading = store.settings.loading;
    const imgUrl = store.settings.theme?.logoUrl;

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement> | any) => {
        e.preventDefault();

        const file = e.target.files[0];
        if (!file) return;
        await api.settings.uploadLogoFile(file);
    };

    return (
        <>
            <h4><b>Logo</b></h4>
            <div className="logo-img">
                <div className="img">
                    <img src={imgUrl ?? '/images/image.svg'} alt="logo" />
                </div>
                <div data-uk-form-custom>
                    <input type="file" onChange={handleFileUpload} />
                    <button className="file-upload" type="button" tabIndex={-1}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-upload">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg> &nbsp;&nbsp;
                        upload logo

                        {loading && <span data-uk-spinner="ratio: .9"></span>}
                    </button>

                </div>
            </div>
        </>
    );
});


export default LogoSettings;