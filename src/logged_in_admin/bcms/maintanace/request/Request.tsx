import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import RequestGrid from "./grid/RequestGrid";
import Modal from "../../../../shared/components/Modal";
import { MaintenanceRequestDialog } from "../../../dialogs/maintenance/maintenance-request/MaintenanceRequestDialog";
import { RequestTypeDialog } from "../../../dialogs/maintenance/RequestTypeDialog";

export const RequestMaintenance = observer(() => {
  const { api, store } = useAppContext();
  const me = store.user.meJson;
  
    const requests = store.maintenance.maintenance_request.all.map((a) => {
      return a.asJson;
    });
  
    // const filteredAnnouncements = announcements.sort(
    //   (a, b) =>
    //     new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
    // );
  
    const onCreate = () => {
      showModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_MAINTENANCE_REQUEST);
    };
    const createRequestType = () => {
      showModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_REQUEST_TYPE);
    };
  
    useEffect(() => {
      const getData = async () => {
        if (me?.property) {
          await api.maintenance.maintenance_request.getAll(me.property);
        }
      };
      getData();
    }, []);

  return (
    <>
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Maintainance Request</h4>
          <div className="controls">
            <div className="uk-inline" style={{marginRight:"30px"}}>
            <button className="uk-button primary"  onClick={onCreate}>
                Create Request
              </button>
            </div>
            <div className="uk-inline" style={{marginRight:"30px"}}>
            <button className="uk-button primary" /*onClick={onView}*/>
                View Request Type
              </button>
            </div>
             <div className="uk-inline">
            <button className="uk-button primary" onClick={createRequestType}>
                Create Request Type
              </button>
            </div>
          </div>
        </div>
        <RequestGrid data={requests}/>
      </div>
    </div>
    <Modal modalId={DIALOG_NAMES.MAINTENANCE.CREATE_MAINTENANCE_REQUEST}>
            <MaintenanceRequestDialog />
          </Modal>
    <Modal modalId={DIALOG_NAMES.MAINTENANCE.CREATE_REQUEST_TYPE}>
            <RequestTypeDialog />
    </Modal>
    </>
  );
});
