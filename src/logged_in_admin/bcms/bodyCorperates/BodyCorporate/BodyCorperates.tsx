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
                className="uk-card uk-card-default uk-card-body uk-width-1-1@m"
                style={{
         
                  backgroundPosition: "right",
                  backgroundSize: "45%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <table className="uk-table uk-table uk-table-divider">
                  <thead>
                    <tr>
                      <th>Index</th>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Bank Name</th>
                      <th>Branch Name</th>
                      <th>Branch Code</th>

                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBodies.map((props, index) => (
                      <tr key={props.asJson.id}>
                        <td>
                          <span>{index}</span>{" "}
                        </td>
                        <td>
                          <span>{props.asJson.BodyCopName}</span>{" "}
                        </td>
                        <td>
                          <span>{props.asJson.location}</span>{" "}
                        </td>
                        <td>
                          <span>{props.asJson.bankName}</span>{" "}
                        </td>
                        <td>
                          <span>{props.asJson.branchName}</span>{" "}
                        </td>
                        <td>
                          <span>{props.asJson.branchCode}</span>{" "}
                        </td>
                        <td style={{ zIndex: "-1" }}>
                          <span
                            style={{
                              background: "#000c37",
                              color: "white",
                              paddingLeft: "16px",
                              paddingRight: "0px",
                              paddingTop: "2px",
                              paddingBottom: "6px",
                              borderRadius: "2rem",
                            }}
                          >
                            <CorporateCard
                              key={props.asJson.id}
                              body={props.asJson}
                            />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
