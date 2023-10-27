import { observer } from "mobx-react-lite";
import { useState, FormEvent, useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import { IRequestType, defaultRequestType } from "../../../../shared/models/maintenance/request/maintenance-request/types/RequestTypes";
import DIALOG_NAMES from "../../Dialogs";
import RequestTypeGrid from "../../../bcms/maintanace/request-type/RequestTypeGrid";

export const ViewRequestTypes = observer(() => {
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

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year) {
      }
    };
    getData();
    if (store.maintenance.requestType.selected && me?.property)
    setRequestType(store.maintenance.requestType.selected);
    else setRequestType({ ...defaultRequestType });

    return () => {};
  }, [store.maintenance.requestType.selected]);

  console.log("Type"+ requestType);

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
        <RequestTypeGrid data={[requestType]}/>
        {/* <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr key={requestType.id}>
          <td>{requestType.typeName}</td>
          <td>
            <button
              className="uk-margin-right uk-icon"
              data-uk-icon="pencil"
              onClick={() => onUpdate()}
            ></button>
            <br></br>
            <button
              className="uk-margin-right uk-icon"
              data-uk-icon="trash"
            // onClick={() => onDelete()}  {/* Assuming onDelete() is used to delete the item */}
            {/* ></button>
          </td>
        </tr>
      </tbody>
    </table> */} 
        </div>
      </div>
    </div>
  );
});
