import React, { useEffect, useState } from "react";
import Toolbar2 from "../../../shared/Toolbar2";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { observer } from "mobx-react-lite";
import Modal from "../../../../shared/components/Modal";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId, {
  hideModalFromId,
} from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import { ICreditNote } from "../../../../shared/models/credit-notes-returns/CreditNotesReturns";
import SaveIcon from "@mui/icons-material/Save";
import { SuccessfulAction } from "../../../../shared/models/Snackbar";
import CreditNoteGrid from "./grid/CreditNoteGrid";

const CustomerCreditNotes = observer(() => {
  const { store, api, ui } = useAppContext();
  const me = store.user.meJson;
  const [unitId, setUnitId] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [customerRef, setCustomerRef] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const createCreditNote = async (e: any) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (!me?.property || !me?.year || !me?.month) {
        throw new Error("Property, year, or month is missing.");
      }

      const creditNote: ICreditNote = {
        id: "",
        unitId: unitId,
        balance: balance,
        invoiceNumber: invoiceNumber,
        customerReference: customerRef,
      };

      await api.body.creditNote.create(
        creditNote,
        me.property,
        me.year,
        me.month,
        unitId
      );

      hideModalFromId(DIALOG_NAMES.BODY.CREDIT_NOTE);
      SuccessfulAction(ui);
    } catch (error) {
      console.error(error);
      // Handle the error as needed (e.g., display a user-friendly message)
    } finally {
      setLoading(false);
    }
  };

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.CREDIT_NOTE);
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property) await api.unit.getAll(me?.property);
      if (me?.property && me?.year)
        await api.body.copiedInvoice.getAll(me.property, me.year);
      if (me?.property && me?.year)
        await api.body.creditNote.getAll(me.property, me.year, me.month);
    };
    getData();
  }, []);

  const units = store.bodyCorperate.unit.all.map((u) => {
    return u.asJson;
  });

  return (
    <div>
      <Toolbar2
        leftControls={
          <div className="">
            <IconButton
              uk-tooltip="Create Customer Credit Note"
              onClick={onCreate}
            >
              <CreateNewFolderIcon />
            </IconButton>
          </div>
        }
        rightControls={
          <div>
            <IconButton uk-tooltip="Print invoices">
              <PrintIcon />
            </IconButton>
            <IconButton uk-tooltip="Export to pdf">
              <PictureAsPdfIcon />
            </IconButton>
            <IconButton uk-tooltip="Export to csv">
              <ArticleIcon />
            </IconButton>
          </div>
        }
      />
      <CreditNoteGrid
        data={store.bodyCorperate.creditNote.all.map((u) => {
          return u.asJson;
        })}
        units={units}
      />

      <Modal modalId={DIALOG_NAMES.BODY.CREDIT_NOTE}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            // onClick={clear}
          ></button>
          <h4 style={{ textTransform: "uppercase" }} className="uk-modal-title">
            Create credit note
          </h4>
          <form
            className="uk-grid-small"
            onSubmit={createCreditNote}
            data-uk-grid
          >
            <div className="uk-width-1-1 uk-margin">
              <label>Select Customer (Unit)</label>
              <select
                className="uk-input"
                onChange={(e) => setUnitId(e.target.value)}
                required
              >
                <option value="">Select Customer (unit)</option>
                {store.bodyCorperate.unit.all.map((u) => (
                  <option value={u.asJson.id}>Unit {u.asJson.unitName}</option>
                ))}
              </select>
            </div>
            <div className="uk-width-1-1 uk-margin">
              <label>Balance</label>
              <input
                className="uk-input"
                type="number"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                required
              />
            </div>
            <div className="uk-width-1-1 ">
              <label>Select Invoice</label>
              <select
                className="uk-input"
                onChange={(e) => setInvoiceNumber(e.target.value)}
              >
                <option value="">Select Invoice</option>
                {store.bodyCorperate.copiedInvoices.all
                  .filter((inv) => inv.asJson.unitId === unitId)
                  .map((inv) => (
                    <option value={inv.asJson.invoiceNumber}>
                      Invoice Number: {inv.asJson.invoiceNumber} | Total Paid
                      {": "}
                      N$ {inv.asJson.totalPaid.toFixed(2)} | Total Due: N${" "}
                      {inv.asJson.totalDue.toFixed(2)}
                    </option>
                  ))}
              </select>
            </div>
            <div className="uk-width-1-1 uk-margin">
              <label>Customer Reference</label>
              <input
                value={customerRef}
                onChange={(e) => setCustomerRef(e.target.value)}
                className="uk-input"
                type="text"
                aria-label="25"
              />
            </div>

            <IconButton
              disabled={loading}
              type="submit"
              uk-tooltip="Export to csv"
            >
              <SaveIcon />
            </IconButton>
            {loading && <>loading...</>}
          </form>
        </div>
      </Modal>
    </div>
  );
});

export default CustomerCreditNotes;
