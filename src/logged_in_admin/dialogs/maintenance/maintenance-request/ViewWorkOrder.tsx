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
import { useNavigate, useParams } from "react-router-dom";
import {
  cannotUpdate,
  generateMaintenanceRequestReference,
  getAwardedEmail,
  getIconForExtensionExtra,
} from "../../../shared/common";
import {
  MAIL_SERVICE_PROVIDER_LINK,
  MAIL_SUCCESSFULL_SERVICE_PROVIDER,
} from "../../../shared/mailMessages";
import SingleSelect from "../../../../shared/components/single-select/SlingleSelect";
import folderIcon from "./assets/folder_3139112.png";
import { mailSuccessfulServiceProvider } from "../../../shared/mailMessagesSP";

export const ViewWorkOrderDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;
  const { maintenanceRequestId } = useParams();
  const currentDate = new Date();
  const dateCreated = currentDate.toUTCString();
  const navigate = useNavigate();

  const [workOrder, setWorkOrder] = useState<IWorkOrderFlow>({
    ...defaultMaintenanceworkOrder,
  });

  const prefix = store.maintenance.maintenance_request.getById(
    maintenanceRequestId || ""
  );

  const _serviceProviders = store.maintenance.servie_provider.all.map((sp) => {
    return sp.asJson;
  });

  const awardedEmail = getAwardedEmail(
    _serviceProviders,
    workOrder.successfullSP
  );

  const identity = prefix?.asJson.description.slice(0, 2);

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API

    if (maintenanceRequestId) {
      try {
        if (store.maintenance.work_flow_order.selected) {
          workOrder.status = "In-Progress";

          const deptment = await api.maintenance.work_flow_order.update(
            workOrder,
            me.property,
            maintenanceRequestId
          );

          try {
            await mailSuccessfulServiceProvider(
              [awardedEmail || ""],
              workOrder.workOrderNumber,
              workOrder.description,
              workOrder.dueDate
            );
          } catch (error) {
            console.log(error);
          }

          // const { MY_SUBJECT, MY_BODY } = MAIL_SUCCESSFULL_SERVICE_PROVIDER(
          //   workOrder.workOrderNumber,
          //   workOrder.description,
          //   `${new Date(workOrder.dueDate).toDateString()} ${new Date(
          //     workOrder.dueDate
          //   ).toTimeString()}`
          // );
          // //only to choosen service provider.
          // await api.mail.sendMail(
          //   "",
          //   [awardedEmail || ""],
          //   MY_SUBJECT,
          //   MY_BODY,
          //   ""
          // );

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
            // `http://localhost:3000/service-provider-quotes/${workOrder.propertyId}/${maintenanceRequestId}/${workOrder.id}`
            `https://vanwylbcms.web.app/service-provider-quotes/${workOrder.propertyId}/${maintenanceRequestId}/${workOrder.id}`
          );

          await api.mail.sendMail(
            "",
            ["narib98jerry@gmail.com"],
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
      hideModalFromId(DIALOG_NAMES.MAINTENANCE.VIEW_WORK_ORDER);
    }
  };

  const serviceProviders = store.maintenance.servie_provider.all.map((w) => {
    return {
      label: w.asJson.serviceProvideName,
      value: w.asJson.id,
    };
  });

  const handleSelectSp = (id: string) => {
    setWorkOrder((prevWorkOrder) => ({
      ...prevWorkOrder,
      successfullSP: id,
    }));
  };

  const specificServiceProvider = store.maintenance.servie_provider.all.find(
    (sp) => sp.asJson.id === workOrder.successfullSP
  );

  const serviceProviderName = specificServiceProvider
    ? specificServiceProvider.asJson.serviceProvideName
    : null;

  const reset = () => {
    setWorkOrder({ ...defaultMaintenanceworkOrder });
    store.maintenance.work_flow_order.clearSelected();
  };

  const viewQuote = (workOrderId: string, id: string) => {
    navigate(
      `/c/maintainance/request/quote-info/${maintenanceRequestId}/${workOrderId}/${id}`
    );
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
    <div
      className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
      style={{ width: "50%" }}
    >
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
                  disabled
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
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Uploaded Quote Folders
              </label>

              <div
                className="uk-child-width-1-6@m uk-grid-small uk-grid-match"
                data-uk-grid
              >
                {workOrder.quoteFiles.map((f) => {
                  return (
                    <div style={{ textAlign: "center" }}>
                      <div
                        className="uk-card uk-card-body"
                        data-uk-tooltip={
                          store.maintenance.servie_provider.all.find(
                            (s) => s.asJson.id === f.id
                          )?.asJson.serviceProvideName
                        }
                        onClick={() => viewQuote(workOrder.id, f.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="image-container">
                          <img src={folderIcon} alt="image" />
                          <div className="icon-container"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {workOrder.quoteFiles.length === 0 && (
                  <span style={{ color: "red" }}>No folders</span>
                )}
              </div>
            </div>
            {workOrder.successfullSP === "" && (
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="form-stacked-text">
                  Choose Successful Service Provider
                </label>
                <div className="uk-form-controls">
                  <SingleSelect
                    onChange={handleSelectSp}
                    options={serviceProviders}
                  />
                </div>
              </div>
            )}
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Due Date
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="datetime-local"
                  // placeholder="Title"
                  disabled={cannotUpdate(workOrder.status)}
                  value={workOrder.dueDate}
                  onChange={(e) =>
                    setWorkOrder({
                      ...workOrder,
                      dueDate: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {workOrder.successfullSP !== "" && (
              <div className="uk-margin">
                Successfull Service Provider: {serviceProviderName}
              </div>
            )}

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
