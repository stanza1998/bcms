import { observer } from "mobx-react-lite";
import { useState, FormEvent, useEffect } from "react";
import SingleSelect from "../../../../shared/components/single-select/SlingleSelect";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import {
  IMaintenanceRequest,
  defaultMaintenanceRequest,
} from "../../../../shared/models/maintenance/request/maintenance-request/MaintenanceRequest";
import { maintenanceRequestCreatedSuccessfullyOwner } from "../../../shared/maiMessagesOwner";
import { mailMaintenanceRequestCreatedSuccessfulManager } from "../../../shared/mailMessagesManager";
import DIALOG_NAMES from "../../Dialogs";

export const OwnerRequestDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [unitId, setUnitId] = useState<string>("");
  const me = store.user.meJson;
  const currentDate = new Date();
  const dateIssued = currentDate.toUTCString();
  const [maintenanceRequest, setMaintenanceRequest] =
    useState<IMaintenanceRequest>({
      ...defaultMaintenanceRequest,
      ownerId: me?.uid || "",
      unitId: unitId,
    });
  const sendToOwner = me?.email;
  const sendToManager = ["narib98jerry@gmail.com", "dinahmasule@gmail.com"];  //problem here
  const [attemptedSave, setAttemptedSave] = useState(false); // Track if the user attempted to save the form
  // const attemptedSaveLog = () => {
  //   if (!me?.property || unitId === "") {
  //     setAttemptedSave(true);
  //   } // Prevent form submission if unitId is empty
  // };
  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    setAttemptedSave(true);
    e.preventDefault();
    setLoading(true);

    if (unitId===""){
      setAttemptedSave(false);
    }
    
    if (!me?.property || unitId === "") return; 
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
        maintenanceRequest.dateRequested = dateIssued;
        maintenanceRequest.ownerId = me.uid || "";
        maintenanceRequest.unitId = unitId;

        await api.maintenance.maintenance_request.create(
          maintenanceRequest,
          me.property
        );

        try {
          await mailMaintenanceRequestCreatedSuccessfulManager(
            sendToManager,
            maintenanceRequest.description,
            `${me.firstName + " " + me.lastName}`
          );
        } catch (error) {}

        try {
          await maintenanceRequestCreatedSuccessfullyOwner([sendToOwner || ""]);
        } catch (error) {}

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
    hideModalFromId(DIALOG_NAMES.OWNER.CREATE_REQUEST);
  };

  const reset = () => {
    setMaintenanceRequest({ ...defaultMaintenanceRequest });
    store.maintenance.maintenance_request.clearSelected();
  };

  const units = store.bodyCorperate.unit.all
    .filter((u) => u.asJson.ownerId === me?.uid)
    .map((u) => {
      return {
        label: "Unit " + u.asJson.unitName,
        value: u.asJson.id,
      };
    });

  const handleSelectUnit = (id: string) => {
    setUnitId(id);
  };

  useEffect(() => {
    if (store.maintenance.maintenance_request.selected)
      setMaintenanceRequest(store.maintenance.maintenance_request.selected);
    else setMaintenanceRequest({ ...defaultMaintenanceRequest });

    return () => {};
  }, [store.maintenance.maintenance_request.selected]);

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.unit.getAll(me.property);
      }
    };
    getData();
  }, [api.unit, me?.property]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={reset}
      ></button>

      <h3 className="uk-modal-title">Maintenance Request</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Please describe your problem in detail
                {maintenanceRequest.description === "" && (
                  <span style={{ color: "red" }}>*</span>
                )}
              </label>
              <div className="uk-form-controls">
                <textarea
                  className="uk-input"
                  placeholder="Description"
                  value={maintenanceRequest.description}
                  style={{ height: "7rem" }}
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
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Please select your unit{" "}
                {!unitId && <span style={{ color: "red" }}>*</span>}
              </label>
              <div className="uk-form-controls">
                <SingleSelect onChange={handleSelectUnit} options={units} />
                {(attemptedSave === true && unitId ==="" ) && <span style={{ color: "red" }}>Enter unit id</span>}
              </div>
            </div>

            <div className="footer uk-margin">
              <button className="uk-button secondary uk-modal-close">
                Cancel
              </button>
              <button
                className="uk-button primary"
                type="submit"
                disabled={!unitId}
              >
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
