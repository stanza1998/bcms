import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useEffect, useRef, useState } from "react";
import { ICreditNote } from "../../../../../shared/models/credit-notes-returns/CreditNotesReturns";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { SuccessfulAction } from "../../../../../shared/models/Snackbar";
import Toolbar2 from "../../../../shared/Toolbar2";
import { IconButton } from "@mui/material";
import CreditNoteGrid from "./grid/CreditNoteGrid";
import Modal from "../../../../../shared/components/Modal";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import SaveIcon from "@mui/icons-material/Save";
import ArrowCircleUpSharpIcon from "@mui/icons-material/ArrowCircleUpSharp";
import { nadFormatter } from "../../../../shared/NADFormatter";
import NumberInput from "../../../../../shared/functions/number-input/NumberInput";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const CustomerCreditNotes = observer(() => {
  const { store, api, ui } = useAppContext();
  const me = store.user.meJson;
  const [unitId, setUnitId] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [customerRef, setCustomerRef] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string>("");

  const createCreditNote = async () => {
    try {
      setLoading(true);

      if (!me?.property || !me?.year || !me?.month) {
        throw new Error("Property, year, or month is missing.");
      }
      const creditNote: ICreditNote = {
        id: "",
        date: date,
        unitId: unitId,
        balance: balance,
        invoiceNumber: invoiceNumber,
        customerReference: customerRef,
      };

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
      if (me?.property) await api.body.account.getAll(me?.property);
    };
    getData();
  }, []);

  const units = store.bodyCorperate.unit.all.map((u) => {
    return u.asJson;
  });
  const accounts = store.bodyCorperate.account.all.map((u) => {
    return u.asJson;
  });
  const credits = store.bodyCorperate.creditNote.all.map((u) => {
    return u.asJson;
  });

  const total = credits.reduce(
    (balance, accounts) => balance + accounts.balance,
    0
  );

  const formattedTotal = nadFormatter.format(total);

  //confirm dialog
  const toast = useRef<Toast>(null);

  const accept = () => {
    createCreditNote();
    toast.current?.show({
      severity: "info",
      summary: "Credit Note successfully created",
      detail: "Customer Credit Note",
      life: 3000,
    });
  };

  const reject = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Customer Credit Note Not Created",
      detail: "Customer Credit Note",
      life: 3000,
    });
    hideModalFromId(DIALOG_NAMES.BODY.CREDIT_NOTE);
  };

  const confirm = (position: any) => {
    confirmDialog({
      message: "Do you want to create a Customer Credit Note?",
      header: "Customer Credit Note Confirmation",
      icon: "pi pi-info-circle",
      position,
      accept,
      reject,
    });
  };

  return (
    <div>
      <Toolbar2
        leftControls={
          <div className="">
            <span className="uk-margin-right" style={{ fontSize: "18px" }}>
              <ArrowCircleUpSharpIcon style={{ color: "red" }} /> Total Balance:{" "}
              {formattedTotal}
            </span>
          </div>
        }
        rightControls={
          <div>
            <IconButton
              uk-tooltip="Create Customer Credit Note"
              onClick={onCreate}
            >
              <CreateNewFolderIcon />
            </IconButton>
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
        data={store.bodyCorperate.creditNote.all
          .sort(
            (a, b) =>
              new Date(b.asJson.date).getTime() -
              new Date(a.asJson.date).getTime()
          )
          .map((u) => {
            return u.asJson;
          })}
        units={units}
      />
      <Toast ref={toast} />
      <ConfirmDialog />
      <Modal modalId={DIALOG_NAMES.BODY.CREDIT_NOTE}>
        <div
          className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
          style={{ width: "70%" }}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            // onClick={clear}
          ></button>
          <h4 style={{ textTransform: "uppercase" }} className="uk-modal-title">
            Create credit note
          </h4>
          <div className="uk-grid-small" data-uk-grid>
            <div className="uk-width-1-3 ">
              <label>Date</label>
              <input
                className="uk-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="uk-width-1-3 ">
              <label>Customer</label>
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
            <div className="uk-width-1-3 ">
              <label>Balance</label>
              <NumberInput
                value={balance}
                onChange={(e) => setBalance(Number(e))}
              />
            </div>
            <div className="uk-width-1-3 ">
              <label>Invoice</label>
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
            <div className="uk-width-1-3 ">
              <label>Account</label>
              <select
                className="uk-input"
                onChange={(e) => setSelection(e.target.value)}
              >
                <option value="">Select Account (Selection)</option>
                {accounts.map((inv) => (
                  <option value={inv.id}>{inv.name}</option>
                ))}
              </select>
            </div>
            <div className="uk-width-1-3 ">
              <label>Customer Reference</label>
              <input
                value={customerRef}
                onChange={(e) => setCustomerRef(e.target.value)}
                className="uk-input"
                type="text"
                aria-label="25"
              />
            </div>

            <IconButton disabled={loading} onClick={() => confirm("right")}>
              <SaveIcon />
            </IconButton>
            <br />
            {loading && <>loading...</>}
          </div>
        </div>
      </Modal>
    </div>
  );
});

export default CustomerCreditNotes;
