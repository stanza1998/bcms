import { observer } from "mobx-react-lite";
import Modal from "../../../../../../../shared/components/Modal";
import { FinacialYearDialog } from "../../../../../../dialogs/financial-year-dialog/FinancialYearDialog";
import DIALOG_NAMES from "../../../../../../dialogs/Dialogs";
import { useAppContext } from "../../../../../../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import showModalFromId from "../../../../../../../shared/functions/ModalShow";
import { useEffect } from "react";
import folder from "../../assets/folder (3).png";

export const FinacialRecords = observer(() => {
  const { store, api } = useAppContext();
  const { propertyId, id } = useParams();
  const navigate = useNavigate();
  const me = store.user.meJson;
  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.FINANCIAL_YEAR);
  };

  useEffect(() => {
    const getData = async () => {
      if (!me?.property) return;
      await api.body.financialYear.getAll(me.property);
    };
    getData();
  }, [api.body.financialYear, me?.property]);

  const viewYear = (yearId: string) => {
    navigate(`/c/body/body-corperate/${propertyId}/${id}/${yearId}`);
  };

  return (
    <div className="sales-order">
      <h3
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "600" }}
      >
        Financial Records
      </h3>
      <button className="uk-button primary" onClick={onCreate}>
        New Year
      </button>

      <div
        className="uk-child-width-1-6@m uk-grid-small uk-grid-match"
        data-uk-grid
      >
        {store.bodyCorperate.financialYear.all
          .sort((a, b) => a.asJson.year - b.asJson.year)
          .map((year) => (
            <div key={year.asJson.id}>
              <div
                className="uk-card-body folders"
                onClick={() => viewYear(year.asJson.id)}
              >
                <img src={folder} alt="" />
                <p style={{ textAlign: "center", marginTop: "-0.5rem" }}>
                  {year.asJson.year}
                </p>
              </div>
            </div>
          ))}
      </div>

      <Modal modalId={DIALOG_NAMES.BODY.FINANCIAL_YEAR}>
        <FinacialYearDialog />
      </Modal>
    </div>
  );
});
