import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import ServiceProviderGrid from "./grid/ServiceProviderGrid";
import Modal from "../../../../shared/components/Modal";
import { ServiceProviderDialog } from "../../../dialogs/maintenance/maintenance-request/ServiceProviderDialog";
import { UpdateServiceProviderDialog } from "../../../dialogs/maintenance/maintenance-request/UpdateServiceProvider";

export const ServiceProvider = observer(() => {
  const { api, store } = useAppContext();
  const me = store.user.meJson;
  
    const providers = store.maintenance.servie_provider.all.map((a) => {
      return a.asJson;
    });
  
    // const filteredAnnouncements = announcements.sort(
    //   (a, b) =>
    //     new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
    // );
  
    const onCreate = () => {
      showModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_SERVICE_PROVIDER);
    };
  
    useEffect(() => {
      const getData = async () => {
        if (me?.property) {
          await api.maintenance.service_provider.getAll(me.property);
        }
      };
      getData();
    }, [api.maintenance.service_provider, me?.property]);
  return (
    <>
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Service Provider</h4>
          <div className="controls">
            <div className="uk-inline">
            <button className="uk-button primary" onClick={onCreate}>
                Create Provider
              </button>
            </div>
          </div>
        </div>
        <ServiceProviderGrid data={providers}/>
      </div>
    </div>
    <Modal modalId={DIALOG_NAMES.MAINTENANCE.CREATE_SERVICE_PROVIDER}>
      <ServiceProviderDialog/>
    </Modal>
    <Modal modalId={DIALOG_NAMES.MAINTENANCE.UPDATE_SERVICE_PROVIDER}>
      <UpdateServiceProviderDialog/>
    </Modal>
    </>
  );
});
