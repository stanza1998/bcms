import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useEffect, useRef, useState } from "react";
import { ICreditNote } from "../../../../../shared/models/credit-notes-returns/CreditNotesReturns";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import {
  FailedActionAllFields,
  SuccessfulAction,
} from "../../../../../shared/models/Snackbar";
import Toolbar2 from "../../../../shared/Toolbar2";
import { IconButton } from "@mui/material";
import CreditNoteGrid from "./grid/CreditNoteGrid";
import Modal from "../../../../../shared/components/Modal";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowCircleUpSharpIcon from "@mui/icons-material/ArrowCircleUpSharp";
import { nadFormatter } from "../../../../shared/NADFormatter";
import NumberInput from "../../../../../shared/functions/number-input/NumberInput";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { ICustomerTransactions } from "../../../../../shared/models/transactions/customer-transactions/CustomerTransactionModel";
import { ICopiedInvoice } from "../../../../../shared/models/invoices/CopyInvoices";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../shared/database/FirebaseConfig";
import SingleSelect from "../../../../../shared/components/single-select/SlingleSelect";

const CustomerCreditNotes = observer(() => {
  const { store, api, ui } = useAppContext();
  const me = store.user.meJson;

  const [unitId, setUnitId] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");

  const [invoiceId, setInvoiceId] = useState<string>("");
  const [customerRef, setCustomerRef] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string>("");

  const generateRCPNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const formattedNumber = randomNumber.toString().padStart(4, "0");
    const generatedInvoiceNumber = `RCP${formattedNumber}`;
    return generatedInvoiceNumber;
  };

  useEffect(() => {
    const getInvoiceNumber = () => {
      const foundInvoice = store.bodyCorperate.copiedInvoices.all.find(
        (invoice) => invoice.asJson.invoiceId === invoiceId
      );

      if (foundInvoice) {
        const invoiceNumber = foundInvoice.asJson.invoiceNumber;
        setInvoiceNumber(invoiceNumber);
      } else {
        // Handle case where invoice with the specified ID was not found
      }
    };

    getInvoiceNumber();
  }, [invoiceId, store.bodyCorperate.copiedInvoices.all]);

  const createCreditNote = async (e: any) => {
    e.preventDefault();
    if (
      unitId !== "" &&
      invoiceId !== "" &&
      balance !== 0 &&
      selection !== ""
    ) {
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

        const customerTransactionTaxInvoice: ICustomerTransactions = {
          id: "", // You may need to generate a unique ID here
          unitId: creditNote.unitId,
          date: creditNote.date,
          reference: generateRCPNumber(),
          transactionType: "Customer Receipt",
          description: customerRef,
          debit: "",
          credit: balance.toFixed(2),
          balance: "", // Use updatedBalance here instead of (totalDue + updatedBalance)
          balanceAtPointOfTime: "",
          invId: invoiceId,
        };

        if (me?.property && me?.year) {
          await api.body.customer_transactions.create(
            customerTransactionTaxInvoice,
            me.property,
            me.year
          );
        }

        try {
          const copiedInvoicesPath = `/BodyCoperate/${me?.property}/FinancialYear/${me?.year}`;
          const invoiceRef = doc(
            collection(db, copiedInvoicesPath, "CopiedInvoices"),
            invoiceId
          );
          const invoiceSnapshot = await getDoc(invoiceRef);
          if (invoiceSnapshot.exists()) {
            const invoiceData = invoiceSnapshot.data();
            const existingTotalPaid = invoiceData.totalPaid || 0; // Default to 0 if totalPaid doesn't exist
            const updatedTotalPaid = existingTotalPaid + balance;
            console.log(updatedTotalPaid);

            await updateDoc(invoiceRef, {
              totalPaid: updatedTotalPaid,
            });
          } else {
            console.log("Invoice not found.");
            return; // Return early if the invoice doesn't exist
          }
        } catch (error) {
          console.error("Error:", error);
        }

        SuccessfulAction(ui);
      } catch (error) {
        console.error(error);
        // Handle the error as needed (e.g., display a user-friendly message)
      } finally {
        setLoading(false);
        hideModalFromId(DIALOG_NAMES.BODY.CREDIT_NOTE);
      }
    } else {
      FailedActionAllFields(ui);
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
    return {
      label: u.asJson.name,
      value: u.asJson.id,
    };
  });

  const handleAccountSelected = (selectedAccount: string) => {
    setSelection(selectedAccount);
  };

  const credits = store.bodyCorperate.creditNote.all.map((u) => {
    return u.asJson;
  });

  const total = credits.reduce(
    (balance, accounts) => balance + accounts.balance,
    0
  );

  const formattedTotal = nadFormatter.format(total);

  //single select
  const _units = store.bodyCorperate.unit.all
    .sort((a, b) => a.asJson.unitName - b.asJson.unitName)
    .map((u) => {
      return {
        label: "Unit " + u.asJson.unitName,
        value: u.asJson.id,
      };
    });

  const handleSelectUnit = (selectUnit: string) => {
    setUnitId(selectUnit);
  };

  const invs = store.bodyCorperate.copiedInvoices.all
    .filter((inv) => inv.asJson.unitId === unitId)
    .map((inv) => {
      return {
        label:
          inv.asJson.invoiceNumber +
          " Due: " +
          nadFormatter.format(inv.asJson.totalDue),
        value: inv.asJson.invoiceId,
      };
    });

  const handleSelectInvoice = (selectedInvoice: string) => {
    setInvoiceId(selectedInvoice);
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
              <AddCircleOutlineIcon />
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
          <form
            onSubmit={createCreditNote}
            className="uk-grid-small"
            data-uk-grid
          >
            <div className="uk-width-1-2 ">
              <label>
                Date <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="uk-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="uk-width-1-2 ">
              <label>
                Customer <span style={{ color: "red" }}>*</span>
              </label>
              <SingleSelect
                onChange={handleSelectUnit}
                options={_units}
                required
              />
            </div>

            <div className="uk-width-1-2 ">
              <label>
                Invoice <span style={{ color: "red" }}>*</span>
              </label>
              <SingleSelect options={invs} onChange={handleSelectInvoice} />
            </div>
            <div className="uk-width-1-2 ">
              <label>
                Balance <span style={{ color: "red" }}>*</span>
              </label>
              <NumberInput
                value={balance}
                onChange={(e) => setBalance(Number(e))}
                required
              />
            </div>
            <div className="uk-width-1-2 ">
              <label>
                Account <span style={{ color: "red" }}>*</span>
              </label>
              <SingleSelect
                onChange={handleAccountSelected}
                options={accounts}
              />
            </div>
            <div className="uk-width-1-2 ">
              <label>
                Customer Reference <span style={{ color: "red" }}>*</span>
              </label>
              <input
                value={customerRef}
                onChange={(e) => setCustomerRef(e.target.value)}
                className="uk-input"
                type="text"
                aria-label="25"
                required
              />
            </div>
            <div className="uk-width-1-1">
              <button className="uk-button primary margin-left" type="submit">
                Save
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>

            <br />
          </form>
        </div>
      </Modal>
    </div>
  );
});

export default CustomerCreditNotes;
