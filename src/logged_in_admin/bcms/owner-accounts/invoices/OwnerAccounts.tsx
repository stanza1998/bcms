import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { useEffect } from "react";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import { uid } from "chart.js/dist/helpers/helpers.core";
import { pid } from "process";
import BodyCopStore from "../../../../shared/stores/individualStore/properties/BodyCopStore";
import { nadFormatter } from "../../../shared/NADFormatter";

export const OwnerAccount = observer(() => {
  const { store, api, ui } = useAppContext();

  const me = store.user.meJson;

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      if (me?.property) {
        await api.unit.getAll(me?.property);
      }
    };
    getData();
  }, [api.body.body, api.unit]);

  const onView = () => {
    showModalFromId(DIALOG_NAMES.BODY.OWNER_UNIT_VIEW);
  };

  return (
    <div className="uk-section leave-analytics-page sales-order">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">My Units</h4>
          <div className="controls">
            <div className="uk-inline">
              {/* <button
                // onClick={onCreate}
                className="uk-button primary"
                type="button"
              >
                Add Supplier
              </button> */}
            </div>
          </div>
        </div>
        <div
          className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
          data-uk-grid
        >
        
          {store.bodyCorperate.unit.all
            .filter((unit) => unit.asJson.ownerId === me?.uid)
            .map((unit) => (
              <div key={unit.asJson.id}>
                <div
                  className="uk-card uk-card-default uk-card-body"
                  onClick={onView}
                  style={{ cursor: "pointer" }}
                >
                  <p>
                    Property Name:
                    {store.bodyCorperate.bodyCop.all
                      .filter(
                        (body) => body.asJson.id === unit.asJson.bodyCopId
                      )
                      .map((body) => {
                        return body.asJson.BodyCopName;
                      })}
                  </p>
                  <p>Unit Reference: Unit {unit.asJson.unitName}</p>
                  <p>Unit Balance: {nadFormatter.format(unit.asJson.balance)}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Modal modalId={DIALOG_NAMES.BODY.OWNER_UNIT_VIEW}>
        <div
          className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
          style={{ width: "100%" }}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          <h3 className="uk-modal-title">Unit Overwiew</h3>
        </div>
      </Modal>
    </div>
  );
});
