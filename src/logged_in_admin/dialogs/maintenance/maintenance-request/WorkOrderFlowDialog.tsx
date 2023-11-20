import { observer } from "mobx-react-lite";
import { useState, FormEvent, useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
//import { IRequestType, defaultRequestType } from "../../../../shared/models/maintenance/request/maintenance-request/types/RequestTypes";
import DIALOG_NAMES from "../../Dialogs";
import {
  IWorkOrderFlow,
  defaultMaintenanceworkOrder,
} from "../../../../shared/models/maintenance/request/work-order-flow/WorkOrderFlow";
import { useParams } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  generateMaintenanceRequestReference,
  getServiceProviderEmails,
} from "../../../shared/common";
import { MAIL_SERVICE_PROVIDER_LINK } from "../../../shared/mailMessages";

export const WorkOrderFlowDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;
  const { maintenanceRequestId } = useParams();
  const animatedComponents = makeAnimated();
  const currentDate = new Date();
  const dateCreated = currentDate.toUTCString();

  const [workOrder, setWorkOrder] = useState<IWorkOrderFlow>({
    ...defaultMaintenanceworkOrder,
  });
  const prefix = store.maintenance.maintenance_request.getById(
    maintenanceRequestId || ""
  );

  const identity = prefix?.asJson.description.slice(0, 2);

  const serviceProvider = store.maintenance.servie_provider.all
    .map((u) => u.asJson)
    .map((user) => ({
      value: user.id,
      label: user.serviceProvideName,
    }));

  const serviceProvidersEmails = getServiceProviderEmails(
    workOrder.serviceProviderId,
    store
  );

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API

    if (maintenanceRequestId) {
      try {
        if (store.maintenance.work_flow_order.selected) {
          const deptment = await api.maintenance.work_flow_order.update(
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
        } else {
          //send link to sps to provide quotes
          workOrder.dateCreated = dateCreated;
          workOrder.requestId = maintenanceRequestId;
          workOrder.propertyId = me.property || "";
          workOrder.workOrderNumber = generateMaintenanceRequestReference(
            identity || ""
          );

          await api.maintenance.work_flow_order.create(
            workOrder,
            me.property,
            maintenanceRequestId
          );

          const { MY_SUBJECT, MY_BODY } = MAIL_SERVICE_PROVIDER_LINK(
            workOrder.title,
            workOrder.description,
            `http://localhost:3000/service-provider-quotes/${workOrder.propertyId}/${maintenanceRequestId}/${workOrder.id}`
          );

          await api.mail.sendMail(
            "",
            serviceProvidersEmails,
            MY_SUBJECT,
            MY_BODY,
            ""
          );
          ui.snackbar.load({
            id: Date.now(),
            message: "Work Order created!",
            type: "success",
          });
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
      hideModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_WORK_ORDER);
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
      <h3 className="uk-modal-title">Work Order</h3>
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
                />
              </div>
            </div>
            <div className="footer uk-margin">
              <button className="uk-button secondary uk-modal-close">
                Cancel
              </button>
              <button className="uk-button primary" type="submit">
                Save
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});
