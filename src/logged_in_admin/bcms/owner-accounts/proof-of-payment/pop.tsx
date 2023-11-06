import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import { useEffect, useState } from "react";
import SingleSelect from "../../../../shared/components/single-select/SlingleSelect";
import { observer } from "mobx-react-lite";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../shared/database/FirebaseConfig";
import { SuccessfulAction } from "../../../../shared/models/Snackbar";
import Loading from "../../../../shared/components/Loading";

export const Pop = observer(() => {
  const { store, ui, api } = useAppContext();
  const me = store.user.meJson;
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [yearId, setYearId] = useState(""); // Initialize yearId state
  const [loading, setLoading] = useState<boolean>(false);

  const handleYearChange = (selectedYearId: string) => {
    setYearId(selectedYearId);
    updateUserYear(selectedYearId);
  };

  const updateUserYear = async (selectedYearId: string) => {
    setLoading(true);
    try {
      const userRef = doc(collection(db, "Users"), me?.uid);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        await updateDoc(userRef, { year: selectedYearId });
        SuccessfulAction(ui);
        window.location.reload();
      } else {
        console.log("Document not found");
      }
    } catch (error) {
      console.error("Error updating user year:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const setDefaultYear = () => {
      if (me?.year) {
        setYearId(me.year);
      }
    };

    // Call the setDefaultYear function to set the default yearId when the component mounts
    setDefaultYear();
  }, [me?.year]); // Re-run the effect when me?.year changes

  const onUpload = () => {
    showModalFromId(DIALOG_NAMES.OWNER.UPLOAD_POP);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (me?.property && me?.year) {
        await api.body.copiedInvoice.getAll(me.property, me.year);
        await api.body.financialYear.getAll(me.property);
        await api.auth.loadAll;
      }
      setLoading(false);
    };
    getData();
  }, [
    api.auth.loadAll,
    api.body.copiedInvoice,
    api.body.financialYear,
    me?.property,
    me?.year,
  ]);

  //years
  const years = store.bodyCorperate.financialYear.all;

  //invoices
  const invoices = store.bodyCorperate.copiedInvoices.all.map((inv) => {
    return {
      label: inv.asJson.invoiceNumber,
      value: inv.asJson.invoiceId,
    };
  });

  console.log(invoices);

  const handleSelectInivoice = (selectedInvoice: string) => {
    setInvoiceId(selectedInvoice);
  };

  return (
    <div className="uk-section leave-analytics-page">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="uk-container uk-container-large">
            <div className="section-toolbar uk-margin">
              <h4 className="section-heading uk-heading">Proof Of Payments</h4>
              <div className="controls">
                <div className="uk-inline">
                  <button
                    onClick={onUpload}
                    className="uk-button primary"
                    type="button"
                  >
                    Upload POP
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="uk-margin">
                <div className="uk-form-controls" style={{ display: "flex" }}>
                  {years.map((y) => (
                    <label key={y.asJson.id}>
                      <input
                        className="uk-radio uk-margin-left"
                        type="radio"
                        name="radio1"
                        value={y.asJson.id}
                        checked={y.asJson.id === me?.year} // Add this line to check the current selected yearId
                        onChange={(e) => handleYearChange(e.target.value)} // Add this line for the onChange event handler
                      />
                      {y.asJson.year}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Modal modalId={DIALOG_NAMES.OWNER.UPLOAD_POP}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          <form className="uk-grid-small" data-uk-grid>
            <div className="uk-width-1-1">
              <div data-uk-form-custom>
                <input type="file" aria-label="Custom controls" />
                <button className="uk-button uk-button-default" type="button">
                  Select
                </button>
              </div>
            </div>
            <div className="uk-width-1-1">
              <SingleSelect
                onChange={handleSelectInivoice}
                options={invoices}
              />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
});
