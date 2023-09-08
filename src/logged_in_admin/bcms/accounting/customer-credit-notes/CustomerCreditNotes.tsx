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
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import { ICreditNote } from "../../../../shared/models/credit-notes-returns/CreditNotesReturns";
import SaveIcon from "@mui/icons-material/Save";

const CustomerCreditNotes = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const [unitId, setUnitId] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [customerRef, setCustomerRef] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const createCreditNote = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const creditNote: ICreditNote = {
      id: "",
      unitId: unitId,
      balance: balance,
      invoiceNumber: invoiceNumber,
      customerReference: customerRef,
    };
    if (!me?.property && !me?.year && !me?.month) return;

    try {
      await api.body.creditNote.create(
        creditNote,
        me.property,
        me.year,
        me.month,
        unitId
      );
    } catch (error) {
      console.log(error);
    }
    if (me?.property && me?.year && me?.month)
      await api.body.creditNote.create(
        creditNote,
        me.property,
        me.year,
        me.month,
        unitId
      );
    setLoading(false);
  };

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.CREDIT_NOTE);
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property) await api.unit.getAll(me?.property);
      if (me?.property && me?.year)
        await api.body.copiedInvoice.getAll(me.property, me.year);
    };
    getData();
  }, []);

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
                    <option value={invoiceNumber}>
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

            <IconButton type="submit" uk-tooltip="Export to csv">
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
