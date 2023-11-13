import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import RequestTypeGrid from "../../../bcms/maintanace/request-type/RequestTypeGrid";

export const ViewRequestTypes = observer(() => {
  const { api, store } = useAppContext();
  const me = store.user.meJson;

  const requestsTypes = store.maintenance.requestType.all.map((r) => {
    return r.asJson;
  });

  useEffect(() => {
    const getData = async () => {
      try {
        if (me?.property) {
          await api.maintenance.request_type.getAll(me?.property);
        }
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }
    };
    getData();
  }, [api.maintenance.request_type, me?.property]);

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
          <RequestTypeGrid data={requestsTypes} />
        </div>
      </div>
    </div>
  );
});
