import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import ReceiptGrid from "./grid/ReceiptGrid";
import { IReceiptsPayments } from "../../../../../shared/models/receipts-payments/ReceiptsPayments";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";
import Toolbar2 from "../../../../shared/Toolbar2";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import Modal from "../../../../../shared/components/Modal";
import { SuccessfulAction } from "../../../../../shared/models/Snackbar";
import SaveIcon from "@mui/icons-material/Save";
import { IBankingTransactions } from "../../../../../shared/models/banks/banking/BankTransactions";
import ArrowCircleUpSharpIcon from "@mui/icons-material/ArrowCircleUpSharp";
import { nadFormatter } from "../../../../shared/NADFormatter";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../shared/database/FirebaseConfig";
import NumberInput from "../../../../../shared/functions/number-input/NumberInput";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ICustomerTransactions } from "../../../../../shared/models/transactions/customer-transactions/CustomerTransactionModel";
import SingleSelect from "../../../../../shared/components/single-select/SlingleSelect";

const CustomerReceipts = observer(() => {
  const { store, api, ui } = useAppContext();
  const me = store.user.meJson;
  const [rcp, setRCP] = useState<Array<IReceiptsPayments>>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [description, setDescriptioin] = useState<string>("");
  const [debit, setDebit] = useState<number>(0);
  const [balance, setBalance] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [selection, setSelection] = useState<string>("");

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.CREATE_RECEIPT);
  };

  // Generate the rcp number
  const generateInvoiceNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const formattedNumber = randomNumber.toString().padStart(4, "0");
    const generatedInvoiceNumber = `RCP000${formattedNumber}`;
    return generatedInvoiceNumber;
  };

  const createReceipt = async () => {
    setLoading(true);
    try {
      const receipt: IReceiptsPayments = {
        id: "",
        date: date,
        reference: reference,
        transactionType: "Customer Receipt",
        description: description,
        debit: debit.toFixed(2),
        credit: "",
        balance: balance,
        propertyId: me?.property || "",
        unitId: unitId,
        invoiceNumber: invoiceNumber,
        rcp: generateInvoiceNumber(),
        supplierId: "",
      };
      if ((me?.property, me?.year, me?.month))
        try {
          await api.body.receiptPayments.create(receipt, me.property, me.year);
        } catch (error) {
          console.log(error);
        }
      try {
        const copiedInvoicesPath = `/BodyCoperate/${me?.property}/FinancialYear/${me?.year}`;
        const invoiceRef = doc(
          collection(db, copiedInvoicesPath, "CopiedInvoices"),
          invoiceNumber
        );
        const invoiceSnapshot = await getDoc(invoiceRef);
        if (invoiceSnapshot.exists()) {
          const invoiceData = invoiceSnapshot.data();
          const existingTotalPaid = invoiceData.totalPaid || 0; // Default to 0 if totalPaid doesn't exist
          const updatedTotalPaid = existingTotalPaid + debit;
          await updateDoc(invoiceRef, {
            totalPaid: updatedTotalPaid,
          });
        } else {
          console.log("Invoice not found.");
          return; // Return early if the invoice doesn't exist
        }

        const myPath = `BodyCoperate/${me?.property}`;
        const accountRef = doc(collection(db, myPath, "Units"), unitId);
        const userSnapshot = await getDoc(accountRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const currentBalance = userData.balance || 0;
          const newBalance = currentBalance - debit;

          await updateDoc(accountRef, {
            balance: newBalance,
          });
          console.log("Balance updated successfully unit");
        } else {
          console.log("Document not found");
        }
      } catch (error) {
        console.error("Error:", error);
      }

      const bank_transaction: IBankingTransactions = {
        id: "",
        date: date,
        payee: unitId,
        description: description,
        type: "Customer",
        selection: selection,
        reference: "Customer Receipt",
        VAT: "Exempted",
        credit: "",
        debit: debit.toFixed(2),
      };
      try {
        if (me?.property && me?.bankAccountInUse)
          await api.body.banking_transaction.create(
            bank_transaction,
            me.property,
            me.bankAccountInUse
          );
        console.log("transaction created");
      } catch (error) {
        console.log(error);
      }
      const customer_transaction: ICustomerTransactions = {
        id: "",
        unitId: unitId,
        date: date,
        reference: receipt.rcp,
        transactionType: "Customer Receipt",
        description:
          "unit " +
          (units.find((u) => u.id === unitId)?.unitName || 0).toFixed(0),
        debit: "",
        credit: debit.toFixed(2),
        balance: "",
        balanceAtPointOfTime: "",
        invId: receipt.invoiceNumber,
      };
      try {
        if (me?.property && me?.year) {
          await api.body.customer_transactions.create(
            customer_transaction,
            me?.property,
            me?.year
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        hideModalFromId(DIALOG_NAMES.BODY.CREATE_RECEIPT);
        getData();
      }
      toast.current?.show({
        severity: "info",
        summary: "Receipt successfully created",
        detail: "Customer Receipt",
        life: 3000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year && me?.month) {
        await api.body.copiedInvoice.getAll(me.property, me.year);
        await api.unit.getAll(me.property);
        await api.body.receiptPayments.getAll(me.property, me?.year);
        const rcp = store.bodyCorperate.receiptsPayments.all
          .sort(
            (a, b) =>
              new Date(b.asJson.date).getTime() -
              new Date(a.asJson.date).getTime()
          )
          .filter((rcp) => rcp.asJson.transactionType === "Customer Receipt")
          .map((rcp) => {
            return rcp.asJson;
          });
        setRCP(rcp);
      }
    };
    getData();
  }, []);

  const getData = async () => {
    if (me?.property && me?.year && me?.month) {
      await api.body.copiedInvoice.getAll(me.property, me.year);
      await api.unit.getAll(me.property);
      await api.body.account.getAll(me.property);
      await api.body.receiptPayments.getAll(me.property, me?.year);
      const rcp = store.bodyCorperate.receiptsPayments.all
        .filter((rcp) => rcp.asJson.transactionType === "Customer Receipt")
        .map((rcp) => {
          return rcp.asJson;
        });
      setRCP(rcp);
    }
  };

  const invoices = store.bodyCorperate.copiedInvoices.all.map((inv) => {
    return inv.asJson;
  });
  const units = store.bodyCorperate.unit.all.map((inv) => {
    return inv.asJson;
  });
  // const accounts = store.bodyCorperate.account.all.map((inv) => {
  //   return inv.asJson;
  // });

  const accounts = store.bodyCorperate.account.all.map((u) => {
    return {
      value: u.asJson.id,
      label: u.asJson.name,
    };
  });

  const handleSelectChange = (selectedValue: string) => {
    setSelection(selectedValue);
  };

  const totalDebits = rcp.reduce(
    (debit, rcp) => debit + parseInt(rcp.debit),
    0
  );

  const formattedDebits = nadFormatter.format(totalDebits);

  //confirm-dialog
  const toast = useRef<Toast>(null);

  const accept = () => {
    createReceipt();
  };

  const reject = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Receipt Not Created",
      detail: "Customer Receipt Not created",
      life: 3000,
    });
    hideModalFromId(DIALOG_NAMES.BODY.CREATE_RECEIPT);
  };

  const confirm = (position: any) => {
    confirmDialog({
      message: "Do you want to create a customer receipt?",
      header: "Customer Receipt Confirmation",
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
              <ArrowCircleUpSharpIcon style={{ color: "red" }} /> Total Inflows:{" "}
              {formattedDebits}
            </span>
          </div>
        }
        rightControls={
          <div>
            <IconButton uk-tooltip="Create Customer Receipt" onClick={onCreate}>
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
      <ReceiptGrid data={rcp} />
      <Toast ref={toast} />
      <ConfirmDialog />
      <Modal modalId={DIALOG_NAMES.BODY.CREATE_RECEIPT}>
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
            Create customer receipt
          </h4>
          <div className="uk-grid-small" data-uk-grid>
            <div className=" uk-width-1-2 ">
              <label>Customer</label>
              <select
                className="uk-input"
                onChange={(e) => setUnitId(e.target.value)}
              >
                <option>Select Unit</option>
                {units.map((u) => (
                  <option value={u.id}>Unit {u.unitName}</option>
                ))}
              </select>
            </div>
            <div className=" uk-width-1-2 ">
              <label>date</label>
              <input
                className="uk-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className=" uk-width-1-2 ">
              <label>Reference</label>
              <input
                className="uk-input"
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className=" uk-width-1-2 ">
              <label>Description</label>
              <input
                className="uk-input"
                type="text"
                value={description}
                onChange={(e) => setDescriptioin(e.target.value)}
              />
            </div>
            <div className=" uk-width-1-2 ">
              <label>Amount</label>
              <NumberInput
                value={debit}
                onChange={(e) => setDebit(Number(e))}
              />
            </div>
            <div className=" uk-width-1-2 ">
              <label>Invoice</label>
              <select
                className="uk-input"
                onChange={(e) => setInvoiceNumber(e.target.value)}
              >
                <option>Select Invoice</option>
                {invoices
                  .filter((inv) => inv.unitId === unitId)
                  .map((inv) => (
                    <option value={inv.invoiceId}>
                      Invoice Number: {inv.invoiceNumber} | Total Paid:{" "}
                      {inv.totalPaid} | Total Due {inv.totalDue}
                    </option>
                  ))}
              </select>
            </div>
            <div className=" uk-width-1-2 ">
              <label>Account (Selection)</label>

              <SingleSelect options={accounts} onChange={handleSelectChange} />

              {/* <select
                className="uk-input"
                onChange={(e) => setSelection(e.target.value)}
              >
                <option>Select Account</option>
                {accounts.map((inv) => (
                  <option value={inv.id}>{inv.name}</option>
                ))}
              </select> */}
            </div>
            <div className=" uk-width-1-1 ">
              <button
                className="uk-button primary margin-left"
                onClick={() => confirm("right")}
              >
                Save Receipt
              </button>
              {/* <IconButton onClick={() => confirm("right")}>
                <SaveIcon />
              </IconButton> */}
            </div>

            {loading && <p>loading...</p>}
          </div>
        </div>
      </Modal>
    </div>
  );
});

export default CustomerReceipts;
