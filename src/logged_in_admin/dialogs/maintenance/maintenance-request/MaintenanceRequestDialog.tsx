import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../Dialogs";
import { IMaintenanceRequest, defaultMaintenanceRequest } from "../../../../shared/models/maintenance/request/maintenance-request/MaintenanceRequest";

export const MaintenanceRequestDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;
  const currentDate = new Date();

  const [maintenanceRequest, setMaintenanceRequest] =
    useState<IMaintenanceRequest>({
      ...defaultMaintenanceRequest,
    });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API

    try {
      if (store.maintenance.maintenance_request.selected) {
        const deptment = await api.maintenance.maintenance_request.update(
          maintenanceRequest,
          me.property
        );
        await store.maintenance.maintenance_request.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "maintenanceRequest updated!",
          type: "success",
        });
      } else {
        // maintenanceRequest.authorOrSender = me.uid;
        maintenanceRequest.dateRequested = currentDate.toUTCString();

        await api.maintenance.maintenance_request.create(
          maintenanceRequest,
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

    store.maintenance.maintenance_request.clearSelected();
    setMaintenanceRequest({ ...defaultMaintenanceRequest });
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_MAINTENANCE_REQUEST);
  };

  useEffect(() => {
    if (store.maintenance.maintenance_request.selected)
      setMaintenanceRequest(store.maintenance.maintenance_request.selected);
    else setMaintenanceRequest({ ...defaultMaintenanceRequest });

    return () => {};
  }, [store.maintenance.maintenance_request.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Maintenance Request</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Description
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Description"
                  value={maintenanceRequest.description}
                  onChange={(e) =>
                    setMaintenanceRequest({
                      ...maintenanceRequest,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            {/* <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Owner
                {maintenanceRequest.ownerId ===" "&& <span style={{color:"red", marginLeft:"10px"}}>* Required</span>}
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Owner"
                  value={maintenanceRequest.ownerId.}
                  onChange={(e) =>
                    setMaintenanceRequest({
                      ...maintenanceRequest,
                      ownerId: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div> */}
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Date Requested
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Date"
                  type="date"
                  value={maintenanceRequest.unitId}
                  onChange={(e) =>
                    setMaintenanceRequest({
                      ...maintenanceRequest,
                      unitId: e.target.value,
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
