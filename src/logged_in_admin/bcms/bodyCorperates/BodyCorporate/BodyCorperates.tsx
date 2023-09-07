import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import { useEffect, useState } from "react";
import Loading from "../../../../shared/components/Loading";
import { PropertyDialog } from "../../../dialogs/property-dialog/PropertyDialog";
import CustomerGrid from "./CustomerGrid";

export const BodyCorperates = observer(() => {
  const { store, api } = useAppContext();
  const [loading, setLoading] = useState(true);
  const filteredBodies = store.bodyCorperate.bodyCop.all;
  const me = store.user.meJson;

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

  const finalList = filteredBodies.sort((a, b) => {
    if (a.asJson.id === me?.property) return -1; // 'abc' comes first
    if (b.asJson.id === me?.property) return 1; // 'abc' comes first
    return 0; // keep the order for non-'abc' elements
  });

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
                <div className="uk-inline"></div>
              </div>
            </div>
            <CustomerGrid
              data={finalList.map((c) => {
                return c.asJson;
              })}
            />
          </div>
          <Modal modalId={DIALOG_NAMES.BODY.BODY_CORPORATE_DIALOG}>
            <PropertyDialog />
          </Modal>
        </>
      )}
    </div>
  );
});
