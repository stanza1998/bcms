import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../shared/models/bcms/BodyCorperate";
import { IUnit, defaultUnit } from "../../../../../shared/models/bcms/Units";
import Modal from "../../../../../shared/components/Modal";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import { UnitCard } from "./UnitCard";
import Loading from "../../../../../shared/components/Loading";

export const ViewUnit = observer(() => {
  const { store, api, ui } = useAppContext();
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [viewBody, setBody] = useState<IBodyCop | undefined>({
    ...defaultBodyCop,
  });

  useEffect(() => {
    const getData = async () => {
      if (!propertyId) {
        window.alert("Cannot find ");
      } else {
        await api.body.body.getAll();
        const unit = store.bodyCorperate.bodyCop.getById(propertyId);
        setBody(unit?.asJson);
        await api.body.unit.getAll();
      }
    };
    getData();
  }, [api.body.body, api.body.unit, propertyId, store.bodyCorperate.bodyCop]);

  const back = () => {
    navigate("/c/body/body-corperate");
  };

  const [unit, _setUnit] = useState<IUnit>({
    ...defaultUnit,
  });

  const [loading, setLoading] = useState(false);
  const [loadingS, setLoadingS] = useState(true);

  const resetMaterial = () => {
    _setUnit({ ...defaultUnit });
  };

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (store.bodyCorperate.unit.selected) {
        const supp = await api.body.unit.update(unit);
        if (supp) await store.bodyCorperate.unit.load([supp]);
        ui.snackbar.load({
          id: Date.now(),
          message: "unit updated!",
          type: "success",
        });
      } else {
        // Add the default category ID to the tradingType object
        if (viewBody?.id) unit.bodyCopId = viewBody?.id;

        await api.body.unit.create(unit);
        // if (supp) await store.inventory.tradingCategories.load([supp]);
        ui.snackbar.load({
          id: Date.now(),
          message: "unit created!",
          type: "success",
        });
      }
      resetMaterial();
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update tradingCategories.",
        type: "danger",
      });
    }
    store.bodyCorperate.unit.clearSelected();
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.BODY.BODY_UNIT_DIALOG);
  };

  useEffect(() => {
    if (store.bodyCorperate.unit.selected)
      _setUnit(store.bodyCorperate.unit.selected);
    else _setUnit({ ...defaultUnit });
    return () => {};
  }, [store.bodyCorperate.unit.selected]);

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.BODY_UNIT_DIALOG);
  };

  const clear = () => {
    store.bodyCorperate.unit.clearSelected();
    resetMaterial();
  };

  const unitInfo = (id: string) => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}`);
  };

  //filter
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const filteredUnits = store.bodyCorperate.unit.all
    .filter((unit) => unit.asJson.bodyCopId === viewBody?.id)
    .filter((unit) => unit.asJson.unitName.toString().includes(searchQuery))
    .sort((a, b) => a.asJson.unitName - b.asJson.unitName);

  setTimeout(() => {
    setLoadingS(false);
  }, 1000);

  return (
    <div className="uk-section leave-analytics-page sales-ViewUnit sales-order">
      {loadingS ? (
        <Loading />
      ) : (
        <div className="uk-container uk-container-large">
          <div className="section-toolbar uk-margin">
            <p
              className="section-heading uk-heading"
              style={{ textTransform: "uppercase", cursor: "pointer" }}
              onClick={back}
            >
              {viewBody?.BodyCopName}
            </p>
            <div className="controls">
              <div className="uk-inline">
                <button
                  className="uk-button primary uk-margin-right"
                  type="button"
                  onClick={onCreate}
                >
                  Add Unit
                </button>

                <button
                  className="uk-button primary"
                  type="button"
                  onClick={back}
                >
                  back
                </button>
              </div>
            </div>
          </div>
          <div>
            {/* Search Input */}
            <input
              type="text"
              name=""
              id=""
              className="uk-input uk-form-small uk-margin"
              placeholder="Search by Unit Name"
              style={{ width: "30%" }}
              value={searchQuery}
              onChange={handleSearchChange}
            />

            {/* Units */}
            <div
              className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
              data-uk-grid
            >
              {filteredUnits.map((unit) => (
                <div key={unit.asJson.id} style={{ cursor: "pointer" }}>
                  <div className="uk-card uk-card-default uk-card-body">
                    <div className="uk-text-right hov">
                      <UnitCard key={unit.asJson.id} unit={unit.asJson} />
                    </div>
                    <div
                      onClick={() => unitInfo(unit.asJson.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <h3
                        style={{
                          fontWeight: "700",
                          color: "grey",
                          textTransform: "uppercase",
                          fontSize: "12px",
                        }}
                        className="uk-card-title"
                      >
                        Unit {unit.asJson.unitName}
                      </h3>
                      <h3
                        style={{
                          fontWeight: "700",
                          color: "grey",
                          textTransform: "uppercase",
                          fontSize: "12px",
                        }}
                        className="uk-card-title"
                      >
                        Owner:{" "}
                        {store.user.all
                          .filter(
                            (user) => user.asJson.uid === unit.asJson.ownerId
                          )
                          .map((user) => user.firstName + " " + user.lastName)}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal modalId={DIALOG_NAMES.BODY.BODY_UNIT_DIALOG}>
        <div className="uk-modal-dialog uk-modal-body margin-auto-vertical">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            onClick={clear}
          ></button>

          <h3 className="uk-modal-title"> Unit Details</h3>

          <div className="dialog-content uk-position-relative">
            <div className="reponse-form">
              <form className="uk-form-stacked" onSubmit={onSave}>
                <div
                  className="uk-grid-small uk-child-width-1-1@m"
                  data-uk-grid
                >
                  <div className="uk-width-1-1@m">
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-text"
                    >
                      Unit Number
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input uk-form-small"
                        type="Number"
                        // placeholder="Type"
                        value={unit.unitName}
                        onChange={(e) =>
                          _setUnit({
                            ...unit,
                            unitName: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="uk-width-1-1@m">
                    <label
                      className="uk-form-label"
                      htmlFor="form-stacked-text"
                    >
                      Select Owner
                    </label>
                    <div className="uk-form-controls">
                      <select
                        name=""
                        className="uk-input uk-form-small"
                        id=""
                        value={unit.ownerId}
                        onChange={(e) =>
                          _setUnit({
                            ...unit,
                            ownerId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Owner</option>
                        {store.user.all
                          .filter((user) => user.role === "Owner")
                          .map((owner) => (
                            <option value={owner.uid}>
                              {owner.firstName} {owner.lastName}
                            </option>
                          ))}
                      </select>
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
});
