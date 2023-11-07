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
import {
  FailedAction,
  FailedActionAllFields,
  SuccessfulAction,
} from "../../../../../shared/models/Snackbar";
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
import { IAccountTransactions } from "../../../../../shared/models/accounts-transaction/AccountsTransactionModel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

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
    const generatedInvoiceNumber = `RCP${formattedNumber}`;
    return generatedInvoiceNumber;
  };

  const createReceipt = async (e: any) => {
    e.preventDefault();
    if (unitId !== "" && invoiceNumber !== "" && debit !== 0) {
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
            await api.body.receiptPayments.create(
              receipt,
              me.property,
              me.year
            );
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
        const accountTransactionReceipt: IAccountTransactions = {
          id: "",
          date: receipt.date,
          BankCustomerSupplier:
            units.find((u) => u.value === unitId)?.label || "",
          reference: receipt.rcp,
          transactionType: "Customer Receipt",
          description: selection,
          debit: debit,
          credit: 0,
          balance: 0,
          accounntType: selection,
        };
        try {
          if (me?.property && me?.year) {
            await api.body.accountsTransactions.create(
              accountTransactionReceipt,
              me.property,
              me.year
            );
          }
          console.log("created");
        } catch (error) {
          console.log(error);
        }
        const customer_transaction: ICustomerTransactions = {
          id: "",
          unitId: unitId,
          date: date,
          reference: receipt.rcp,
          transactionType: "Customer Receipt",
          description: units.find((u) => u.value === unitId)?.label || "",
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
          SuccessfulAction(ui);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      return FailedActionAllFields(ui);
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

  const invoices = store.bodyCorperate.copiedInvoices.all
    .sort(
      (a, b) =>
        new Date(b.asJson.dateIssued).getTime() -
        new Date(a.asJson.dateIssued).getTime()
    )
    .filter(
      (inv) =>
        inv.asJson.unitId === unitId &&
        inv.asJson.totalDue > inv.asJson.totalPaid
    )
    .map((inv) => {
      return {
        label:
          "Date: " +
          inv.asJson.dateIssued +
          " | " +
          inv.asJson.invoiceNumber +
          " Due: " +
          nadFormatter.format(inv.asJson.totalDue - inv.asJson.totalPaid),
        value: inv.asJson.invoiceId,
      };
    });

  const handleSelectInvoiceSelect = (selectedInvoice: string) => {
    setInvoiceNumber(selectedInvoice);
  };

  const units = store.bodyCorperate.unit.all
    .sort((a, b) => a.asJson.unitName - b.asJson.unitName)
    .map((u) => {
      return {
        label: "Unit " + u.asJson.unitName,
        value: u.asJson.id,
      };
    });

  const handleSelectUnit = (selectedUnit: string) => {
    setUnitId(selectedUnit);
  };
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
          <form onSubmit={createReceipt} className="uk-grid-small" data-uk-grid>
            <div className=" uk-width-1-2 ">
              <label>
                date <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="uk-input"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className=" uk-width-1-2 ">
              <label>
                Customer <span style={{ color: "red" }}>*</span>
              </label>
              <SingleSelect onChange={handleSelectUnit} options={units} />
            </div>

            <div className=" uk-width-1-2 ">
              <label>
                Reference <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="uk-input"
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className=" uk-width-1-2 ">
              <label>
                Description <span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="uk-input"
                type="text"
                required
                value={description}
                onChange={(e) => setDescriptioin(e.target.value)}
              />
            </div>
            <div className=" uk-width-1-2 ">
              <label>
                Invoice <span style={{ color: "red" }}>*</span>
              </label>
              <SingleSelect
                onChange={handleSelectInvoiceSelect}
                options={invoices}
              />
            </div>
            <div className=" uk-width-1-2 ">
              <label>
                Amount <span style={{ color: "red" }}>*</span>
              </label>
              <NumberInput
                value={debit}
                onChange={(e) => setDebit(Number(e))}
                required
              />
            </div>

            <div className=" uk-width-1-2 ">
              <label>
                Account (Selection) <span style={{ color: "red" }}>*</span>
              </label>
              <SingleSelect options={accounts} onChange={handleSelectChange} />
            </div>
            <div className=" uk-width-1-1 ">
              <button type="submit" className="uk-button primary margin-left">
                Save
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
});

export default CustomerReceipts;
