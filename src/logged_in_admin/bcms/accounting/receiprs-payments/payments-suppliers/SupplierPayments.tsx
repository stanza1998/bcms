import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import { IReceiptsPayments } from "../../../../../shared/models/receipts-payments/ReceiptsPayments";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";
import PaymentGrid from "./grid/PaymentGrid";
import Toolbar2 from "../../../../shared/Toolbar2";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { SuccessfulAction } from "../../../../../shared/models/Snackbar";
import Modal from "../../../../../shared/components/Modal";
import SaveIcon from "@mui/icons-material/Save";
import { IBankingTransactions } from "../../../../../shared/models/banks/banking/BankTransactions";

const SupplierPayment = observer(() => {
  const { store, api, ui } = useAppContext();
  const me = store.user.meJson;
  const [rcp, setRCP] = useState<Array<IReceiptsPayments>>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [description, setDescriptioin] = useState<string>("");
  const [credit, setCredit] = useState<number>(0);
  const [balance, setBalance] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [selection, setSelection] = useState<string>("");

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.CREATE_SUPPLIER_PAYMENT);
  };

  // Generate the pay number
  const generateInvoiceNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const formattedNumber = randomNumber.toString().padStart(4, "0");
    const generatedInvoiceNumber = `PAY000${formattedNumber}`;
    return generatedInvoiceNumber;
  };

  const createPayment = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const receipt: IReceiptsPayments = {
      id: "",
      date: date,
      reference: reference,
      transactionType: "Supplier Payment",
      description: description,
      debit: "",
      credit: credit.toFixed(2),
      balance: balance,
      propertyId: me?.property || "",
      unitId: "",
      invoiceNumber: "",
      rcp: generateInvoiceNumber(),
      supplierId: supplierId,
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
      payee: supplierId,
      description: selection,
      type: "Supplier",
      selection: selection,
      reference: "Supplier Payment",
      VAT: "Exempted",
      credit: credit.toFixed(2),
      debit: "",
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
      hideModalFromId(DIALOG_NAMES.BODY.CREATE_SUPPLIER_PAYMENT);
      SuccessfulAction(ui);
    }
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year && me?.month) {
        await api.body.receiptPayments.getAll(me.property, me?.year, me?.month);
        const rcp = store.bodyCorperate.receiptsPayments.all
          .filter((rcp) => rcp.asJson.transactionType === "Supplier Payment")
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
      await api.body.receiptPayments.getAll(me.property, me?.year, me?.month);
      const rcp = store.bodyCorperate.receiptsPayments.all
        .filter((rcp) => rcp.asJson.transactionType === "Supplier Payment")
        .map((rcp) => {
          return rcp.asJson;
        });
      setRCP(rcp);
    }
  };
  getData();

  const suppliers = store.bodyCorperate.supplier.all.map((inv) => {
    return inv.asJson;
  });
  const accounts = store.bodyCorperate.account.all.map((a) => {
    return a.asJson;
  });

  return (
    <div>
      <Toolbar2
        leftControls={
          <div className="">
            <IconButton uk-tooltip="Create Invoice" onClick={onCreate}>
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
      <PaymentGrid data={rcp} />
      <Modal modalId={DIALOG_NAMES.BODY.CREATE_SUPPLIER_PAYMENT}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            // onClick={clear}
          ></button>
          <h4 style={{ textTransform: "uppercase" }} className="uk-modal-title">
            Create supplier payment
          </h4>
          <form onSubmit={createPayment}>
            <div className="uk-margin">
              <label>Supplier</label>
              <br />
              <select
                className="uk-input"
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option>Select Supplier</option>
                {suppliers.map((s) => (
                  <option value={s.id}>
                    {s.name} {s.description}
                  </option>
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
              <label>Select Acount</label>
              <br />
              <select
                className="uk-input"
                onChange={(e) => setSelection(e.target.value)}
              >
                <option>Select Account</option>
                {accounts.map((a) => (
                  <option value={a.id}>
                    Supplier {a.name} {a.description}
                  </option>
                ))}
              </select>
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
              <label>Credit</label>
              <br />
              <input
                className="uk-input"
                type="number"
                value={credit}
                onChange={(e) => setCredit(Number(e.target.value))}
              />
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

export default SupplierPayment;
