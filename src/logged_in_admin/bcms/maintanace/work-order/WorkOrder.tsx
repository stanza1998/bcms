import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import { MaintenanceRequestDialog } from "../../../dialogs/maintenance/maintenance-request/MaintenanceRequestDialog";
import { RequestTypeDialog } from "../../../dialogs/maintenance/RequestTypeDialog";
import { ViewRequestTypes } from "../../../dialogs/maintenance/maintenance-request/ViewRequestTypesDialog";
import WorkOrderGrid from "./WorkOrderGrid/WorkOrderGrid";
import { WorkOrderFlowDialog } from "../../../dialogs/maintenance/maintenance-request/WorkOrderFlowDialog";
import { useParams } from "react-router-dom";

export const WorkOrder = observer(() => {
  const { api, store } = useAppContext();
  const {maintenanceRequestId} = useParams();

  console.log(maintenanceRequestId);
  
  const me = store.user.meJson;
      const workFlowOrders = store.maintenance.work_flow_order.all.map((a) => {
      return a.asJson;
    });
  
    // const filteredAnnouncements = announcements.sort(
    //   (a, b) =>
    //     new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime()
    // );
   // VIEW_REQUEST_TYPE

    const onCreate = () => {
      showModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_WORK_ORDER);
    };

    const onView = () => {
      showModalFromId(DIALOG_NAMES.MAINTENANCE.VIEW_REQUEST_TYPE);
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
          <h4 className="section-heading uk-heading">Work Order Flow</h4>
          <div className="controls">
            <div className="uk-inline" style={{marginRight:"30px"}}>
            <button className="uk-button primary"  onClick={onCreate}>
                Create Order 
              </button>
            </div>
          </div>
        </div>
        <WorkOrderGrid data={workFlowOrders}/>
      </div>
    </div>
    <Modal modalId={DIALOG_NAMES.MAINTENANCE.CREATE_WORK_ORDER}>
            <WorkOrderFlowDialog />
          </Modal>
    </>
  );
});
