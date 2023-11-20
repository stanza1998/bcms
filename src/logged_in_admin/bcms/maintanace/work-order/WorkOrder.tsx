import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import WorkOrderGrid from "./WorkOrderGrid/WorkOrderGrid";
import { WorkOrderFlowDialog } from "../../../dialogs/maintenance/maintenance-request/WorkOrderFlowDialog";
import { useNavigate, useParams } from "react-router-dom";
import { cannotCreateOrder, updateById } from "../../../shared/common";
import { ViewWorkOrderDialog } from "../../../dialogs/maintenance/maintenance-request/ViewWorkOrder";
import { ExtendWindowPeriod } from "../../../dialogs/maintenance/maintenance-request/ExtenWindowPeriod";
import { CompleteWorkOrderDialog } from "../../../dialogs/maintenance/maintenance-request/CompleteWorkOrderFlowDialog";

export const WorkOrder = observer(() => {
  const { api, store } = useAppContext();
  const { maintenanceRequestId } = useParams();
  const navigate = useNavigate();

  const me = store.user.meJson;
  const workFlowOrders = store.maintenance.work_flow_order.all
    .sort(
      (a, b) =>
        new Date(b.asJson.dateCreated).getTime() -
        new Date(a.asJson.dateCreated).getTime()
    )
    .filter((a) => a.asJson.requestId === maintenanceRequestId)
    .map((a) => {
      return a.asJson;
    });

  const request = store.maintenance.maintenance_request.getById(
    maintenanceRequestId || ""
  );

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_WORK_ORDER);
  };

  const back = () => {
    navigate("/c/maintainance/request");
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property && maintenanceRequestId) {
        await api.maintenance.work_flow_order.getAll(
          me.property,
          maintenanceRequestId
        );
      }
    };
    getData();
  }, [api.maintenance.work_flow_order, maintenanceRequestId, me?.property]);

  useEffect(() => {
    const updateStatus = async () => {
      if (request?.asJson.status === "Closed") {
        //update here
        if (me?.property && request.asJson.id) {
          await updateById(request.asJson.id, me.property, "Opened");
        }
      } else {
      }
    };
    updateStatus();
  }, [
    api.maintenance.maintenance_request,
    me?.property,
    request?.asJson.id,
    request?.asJson.status,
  ]);

  return (
    <>
      <div className="uk-section leave-analytics-page">
        <div className="uk-container uk-container-large">
          <div className="section-toolbar uk-margin">
            <h5 className="section-heading uk-heading">
              {request?.asJson.description}
            </h5>
            <div className="controls">
              <div className="uk-inline" style={{ marginRight: "30px" }}>
                <button
                style={{background: cannotCreateOrder(workFlowOrders)? "grey":""}} 
                disabled={cannotCreateOrder(workFlowOrders)} className="uk-button primary" onClick={onCreate}>
                  Create Order
                </button>
                <button
                  className="uk-button primary uk-margin-left"
                  onClick={back}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
          <WorkOrderGrid data={workFlowOrders} />
        </div>
      </div>
      <Modal modalId={DIALOG_NAMES.MAINTENANCE.CREATE_WORK_ORDER}>
        <WorkOrderFlowDialog />
      </Modal>
      <Modal modalId={DIALOG_NAMES.MAINTENANCE.VIEW_WORK_ORDER}>
        <ViewWorkOrderDialog />
      </Modal>
      <Modal modalId={DIALOG_NAMES.MAINTENANCE.EXTEND_WINDOW_PERIOD}>
        <ExtendWindowPeriod />
      </Modal>
      <Modal modalId={DIALOG_NAMES.MAINTENANCE.COMPLETE_WORK_ORDER_DIALOG}>
        <CompleteWorkOrderDialog />
      </Modal>
    </>
  );
});
