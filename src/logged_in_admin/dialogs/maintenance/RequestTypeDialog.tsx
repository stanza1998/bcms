import { observer } from "mobx-react-lite";
import { useState, FormEvent, useEffect } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../Dialogs";
import { IRequestType, defaultRequestType } from "../../../shared/models/maintenance/request/maintenance-request/types/RequestTypes";
//import RequestTypeGrid from "../../bcms/maintanace/request-type/RequestTypeGrid";

export const RequestTypeDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;
  const currentDate = new Date();

  const [requestType, setRequestType] =
    useState<IRequestType>({
      ...defaultRequestType,
    });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API

    try {
      if (store.maintenance.requestType.selected) {
        const deptment = await api.maintenance.request_type.update(
            requestType,
          me.property
        );
        await store.maintenance.requestType.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "setRequestType updated!",
          type: "success",
        });
      } else {
        // maintenanceRequest.authorOrSender = me.uid;
        //requestType.dateRequested = currentDate.toLocaleTimeString();

        await api.maintenance.request_type.create(
            requestType,
          me.property
        );
        ui.snackbar.load({
          id: Date.now(),
          message: "Maintenance Request created!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update maintenance Request.",
        type: "danger",
      });
    }

    store.maintenance.requestType.clearSelected();
    setRequestType({...defaultRequestType,
    });
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_REQUEST_TYPE);
  };

//   useEffect(() => {
//     if (store.maintenance.requestType.selected)
//     setRequestType(store.maintenance.maintenance_request.selected);
//     else setRequestType({ ...defaultMaintenanceRequest });

//     return () => {};
//   }, [store.maintenance.maintenance_request.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Request Type</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Type Name
                {requestType.typeName===" "&& <span style={{color:"red", marginLeft:"10px"}}>*</span>}
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Type Name"
                  value={requestType.typeName}
                  onChange={(e) =>
                    setRequestType({
                      ...requestType,
                      typeName: e.target.value,
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
