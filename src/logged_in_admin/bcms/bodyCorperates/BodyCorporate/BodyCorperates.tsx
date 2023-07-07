import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import showModalFromId from "../../../../shared/functions/ModalShow";
import { useEffect, useState } from "react";
// import { BodyDialog } from "../../../dialogs/bodyCorperate/BodyDialog";
import { useNavigate, useParams } from "react-router-dom";
import { CorporateCard } from "./CorporateCard";
import Loading from "../../../../shared/components/Loading";
import { PropertyDialog } from "../../../dialogs/property-dialog/PropertyDialog";

export const BodyCorperates = observer(() => {
  const { store, api, ui } = useAppContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const filteredBodies = store.bodyCorperate.bodyCop.all.filter((body) =>
    body.asJson.BodyCopName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.BODY_CORPORATE_DIALOG);
  };

  const viewUnit = (propertyId: string) => {
    navigate(`/c/body/body-corperate/${propertyId}`);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        await api.body.body.getAll();
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      }
    };
    getData();
  }, [api.body.body]);

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  return (
    <div className="uk-section leave-analytics-page sales-order">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="uk-container uk-container-large">
            <div className="section-toolbar uk-margin">
              <h4
                className="section-heading uk-heading"
                style={{ textTransform: "uppercase" }}
              >
                Properties
              </h4>
              <div className="controls">
                <div className="uk-inline">
                  <button
                    className="uk-button primary"
                    type="button"
                    onClick={onCreate}
                  >
                    Add Property
                  </button>
                </div>
              </div>
            </div>
            <div>
              <input
                type="text"
                name=""
                id=""
                className="uk-input uk-form-small uk-margin"
                placeholder="Search by Property Name"
                style={{ width: "30%" }}
                value={searchQuery}
                onChange={handleSearchChange}
              />

              <div
                className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
                data-uk-grid
              >
                {filteredBodies.map((body) => (
                  <div key={body.asJson.id}>
                    <div className="uk-card uk-card-default uk-card-body">
                      <div className="uk-text-right hov">
                        <CorporateCard
                          key={body.asJson.id}
                          body={body.asJson}
                        />
                      </div>
                      <div
                        onClick={() => viewUnit(body.asJson.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <p>Body Corporate Name</p>
                        <h3
                          style={{
                            fontWeight: "600",
                            color: "grey",
                            textTransform: "uppercase",
                          }}
                          className="uk-card-title"
                        >
                          {body.asJson.BodyCopName}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Modal modalId={DIALOG_NAMES.BODY.BODY_CORPORATE_DIALOG}>
            <PropertyDialog />
          </Modal>
        </>
      )}
    </div>
  );
});
