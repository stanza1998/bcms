import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../Dialogs";
import {
  IMaintenanceRequest,
  defaultMaintenanceRequest,
} from "../../../../shared/models/maintenance/request/maintenance-request/MaintenanceRequest";
import SingleSelect from "../../../../shared/components/single-select/SlingleSelect";
import { useParams } from "react-router-dom";
import {
  MAIL_MAINTENANCE_REQUEST_CREATED_SUCCESSFULLY_LOGGED,
  MAIL_MAINTENANCE_REQUEST_CREATED_SUCCESSFULLY_OWNER,
} from "../../../shared/mailMessages";
import { getOwnersEmail } from "../../../shared/common";

export const MaintenanceRequestDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [ownerId, setOwnerId] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const me = store.user.meJson;
  const { maintenanceRequestId } = useParams();
  const currentDate = new Date();
  const dateIssued = currentDate.toUTCString();

  const _users = store.user.all.map((u) => {
    return u.asJson;
  });

  const sendTo = getOwnersEmail(_users, ownerId);

  const [maintenanceRequest, setMaintenanceRequest] =
    useState<IMaintenanceRequest>({
      ...defaultMaintenanceRequest,
      ownerId: ownerId,
      unitId: unitId,
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
        maintenanceRequest.dateRequested = dateIssued;
        maintenanceRequest.ownerId = ownerId;
        maintenanceRequest.unitId = unitId;

        await api.maintenance.maintenance_request.create(
          maintenanceRequest,
          me.property
        );

        const name = me.firstName + " " + me.lastName;
        const { MY_SUBJECT, MY_BODY } =
          MAIL_MAINTENANCE_REQUEST_CREATED_SUCCESSFULLY_LOGGED(
            maintenanceRequest.description,
            name
          );
        await api.mail.sendMail(
          "",
          //owner email
          [sendTo || ""],
          MY_SUBJECT,
          MY_BODY,
          ""
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

  const reset = () => {
    setMaintenanceRequest({ ...defaultMaintenanceRequest });
    store.maintenance.maintenance_request.clearSelected();
  };

  const owners = store.user.all
    .filter((u) => u.asJson.role === "Owner")
    .map((u) => {
      return {
        label: u.firstName + " " + u.lastName,
        value: u.uid,
      };
    });

  const handleSelectOwner = (id: string) => {
    setOwnerId(id);
  };

  const units = store.bodyCorperate.unit.all
    .filter((u) => u.asJson.ownerId === ownerId)
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
                Description
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
                Owner
                {maintenanceRequest.ownerId === " " && (
                  <span style={{ color: "red", marginLeft: "10px" }}>
                    * Required
                  </span>
                )}
              </label>
              <div className="uk-form-controls">
                <SingleSelect onChange={handleSelectOwner} options={owners} />
              </div>
            </div>

            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Owner Units
              </label>
              <div className="uk-form-controls">
                <SingleSelect onChange={handleSelectUnit} options={units} />
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
