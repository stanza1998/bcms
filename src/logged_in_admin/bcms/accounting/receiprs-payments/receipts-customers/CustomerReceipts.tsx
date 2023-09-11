import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
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

  const createReceipt = async (e: any) => {
    e.preventDefault();
    setLoading(true);
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
          me.year,
          me.month
        );
      } catch (error) {
        console.log(error);
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
    } finally {
      setLoading(false);
      getData();
      hideModalFromId(DIALOG_NAMES.BODY.CREATE_RECEIPT);
      SuccessfulAction(ui);
    }
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year && me?.month) {
        await api.body.copiedInvoice.getAll(me.property, me.year);
        await api.unit.getAll(me.property);
        await api.body.receiptPayments.getAll(me.property, me?.year, me?.month);
        const rcp = store.bodyCorperate.receiptsPayments.all
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
      await api.body.receiptPayments.getAll(me.property, me?.year, me?.month);
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
  const accounts = store.bodyCorperate.account.all.map((inv) => {
    return inv.asJson;
  });

  return (
    <div>
      <Toolbar2
        leftControls={
          <div className="">
            <IconButton uk-tooltip="Create Customer Receipt" onClick={onCreate}>
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
      <ReceiptGrid data={rcp} />
      <Modal modalId={DIALOG_NAMES.BODY.CREATE_RECEIPT}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            // onClick={clear}
          ></button>
          <h4 style={{ textTransform: "uppercase" }} className="uk-modal-title">
            Create customer receipt
          </h4>
          <form onSubmit={createReceipt}>
            <div className="uk-margin">
              <label>Customer (Unit)</label>
              <br />
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
            <div className="uk-margin">
              <label>date</label>
              <br />
              <input
                className="uk-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="uk-margin">
              <label>Reference</label>
              <br />
              <input
                className="uk-input"
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className="uk-margin">
              <label>Description</label>
              <br />
              <input
                className="uk-input"
                type="text"
                value={description}
                onChange={(e) => setDescriptioin(e.target.value)}
              />
            </div>
            <div className="uk-margin">
              <label>Debit</label>
              <br />
              <input
                className="uk-input"
                type="number"
                value={debit}
                onChange={(e) => setDebit(Number(e.target.value))}
              />
            </div>
            <div className="uk-margin">
              <label>Invoice</label>
              <br />
              <select
                className="uk-input"
                onChange={(e) => setInvoiceNumber(e.target.value)}
              >
                <option>Select Invoice</option>
                {invoices
                  .filter((inv) => inv.unitId === unitId)
                  .map((inv) => (
                    <option value={inv.invoiceNumber}>
                      Invoice Number: {inv.invoiceNumber} | Total Paid:{" "}
                      {inv.totalPaid} | Total Due {inv.totalDue}
                    </option>
                  ))}
              </select>
            </div>
            <div className="uk-margin">
              <label>Account (Selection)</label>
              <br />
              <select
                className="uk-input"
                onChange={(e) => setSelection(e.target.value)}
              >
                <option>Select Account</option>
                {accounts.map((inv) => (
                  <option value={inv.id}>{inv.name}</option>
                ))}
              </select>
            </div>
            <IconButton type="submit">
              <SaveIcon />
            </IconButton>
            {loading && <p>loading...</p>}
          </form>
        </div>
      </Modal>
    </div>
  );
});

export default CustomerReceipts;
