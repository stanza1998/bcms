import { observer } from "mobx-react-lite";
import { useState, FormEvent, useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../Dialogs";
import {
  IWorkOrderFlow,
  defaultMaintenanceworkOrder,
} from "../../../../shared/models/maintenance/request/work-order-flow/WorkOrderFlow";
import { useParams } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { workerOrdersAndRequestRelationshipStatusUpdate } from "../../../shared/common";
import { FailedAction } from "../../../../shared/models/Snackbar";

export const CompleteWorkOrderDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;
  const { maintenanceRequestId } = useParams();
  const animatedComponents = makeAnimated();
  const [workOrder, setWorkOrder] = useState<IWorkOrderFlow>({
    ...defaultMaintenanceworkOrder,
  });

  const serviceProvider = store.maintenance.servie_provider.all
    .map((u) => u.asJson)
    .map((user) => ({
      value: user.id,
      label: user.serviceProvideName,
    }));

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API
    if (maintenanceRequestId) {
      try {
        if (store.maintenance.work_flow_order.selected) {
          workOrder.status = "Done";

          await api.maintenance.work_flow_order.update(
            workOrder,
            me.property,
            maintenanceRequestId
          );

          await store.maintenance.work_flow_order.load();
          ui.snackbar.load({
            id: Date.now(),
            message: "Work Order updated!",
            type: "success",
          });

          try {
            await workerOrdersAndRequestRelationshipStatusUpdate(
              maintenanceRequestId,
              me.property,
              "Completed"
            );
          } catch (error) {
            FailedAction(ui);
          }
        }
      } catch (error) {
        ui.snackbar.load({
          id: Date.now(),
          message: "Error! Failed to update Work Order.",
          type: "danger",
        });
      }

      store.maintenance.work_flow_order.clearSelected();
      setWorkOrder({ ...defaultMaintenanceworkOrder });
      setLoading(false);
      hideModalFromId(DIALOG_NAMES.MAINTENANCE.COMPLETE_WORK_ORDER_DIALOG);
    }
  };

  const reset = () => {
    setWorkOrder({ ...defaultMaintenanceworkOrder });
    store.maintenance.work_flow_order.clearSelected();
  };

  useEffect(() => {
    if (store.maintenance.work_flow_order.selected)
      setWorkOrder(store.maintenance.work_flow_order.selected);
    else setWorkOrder({ ...defaultMaintenanceworkOrder });

    return () => {};
  }, [store.maintenance.work_flow_order.selected]);

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.maintenance.service_provider.getAll(me.property);
      }
    };
    getData();
  }, [api.maintenance.service_provider, me?.property]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        onClick={reset}
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Work Order (Complete)</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Title
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Title"
                  value={workOrder.title}
                  onChange={(e) =>
                    setWorkOrder({
                      ...workOrder,
                      title: e.target.value,
                    })
                  }
                  disabled
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Description
              </label>
              <div className="uk-form-controls">
                <textarea
                  className="uk-input uk-form-controls"
                  placeholder="Description"
                  style={{ height: "7rem" }}
                  value={workOrder.description}
                  onChange={(e) =>
                    setWorkOrder({
                      ...workOrder,
                      description: e.target.value,
                    })
                  }
                  required
                  disabled
                />
              </div>
            </div>
            <div className="uk-margin">
              {/*serviceproviders*/}
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Service Providers
              </label>
              <div className="uk-form-controls">
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  onChange={(value: any) =>
                    setWorkOrder({
                      ...workOrder,
                      serviceProviderId: value.map((t: any) => t.value),
                    })
                  }
                  isMulti
                  placeholder="Add Service Providers"
                  options={serviceProvider}
                  value={workOrder.serviceProviderId.map(
                    (serviceProviderId) => {
                      const selectedContact = serviceProvider.find(
                        (contact) => contact.value === serviceProviderId
                      );
                      return selectedContact
                        ? {
                            label: selectedContact.label,
                            value: selectedContact.value,
                          }
                        : null;
                    }
                  )}
                  isDisabled
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Conclusion date and time of the Window Period
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="datetime-local"
                  // placeholder="Title"
                  value={workOrder.windowPeriod}
                  onChange={(e) =>
                    setWorkOrder({
                      ...workOrder,
                      windowPeriod: e.target.value,
                    })
                  }
                  required
                  disabled
                />
              </div>
            </div>
            <div className="footer uk-margin">
              <button className="uk-button secondary uk-modal-close">
                Cancel
              </button>
              <button className="uk-button primary" type="submit">
                Mark as Done
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});
