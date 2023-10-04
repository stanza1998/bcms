import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
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
import ArrowCircleUpSharpIcon from "@mui/icons-material/ArrowCircleUpSharp";
import { nadFormatter } from "../../../../shared/NADFormatter";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../shared/database/FirebaseConfig";
import NumberInput from "../../../../../shared/functions/number-input/NumberInput";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ISupplierTransactions } from "../../../../../shared/models/transactions/supplier-transactions/SupplierTransactions";

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

  const createPayment = async () => {
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
        await api.body.receiptPayments.create(receipt, me.property, me.year);
      } catch (error) {
        console.log(error);
      }

    try {
      const supplierPath = `BodyCoperate/${me?.property}`;
      const supplierRef = doc(
        collection(db, supplierPath, "Suppliers"),
        supplierId
      );

      const supplierSnapShot = await getDoc(supplierRef);
      if (supplierSnapShot.exists()) {
        const supplierData = supplierSnapShot.data();
        const supplierBalance = supplierData.balance || 0;
        const supplierNewBalance = supplierBalance - credit;
        await updateDoc(supplierRef, { balance: supplierNewBalance });

        const supplier_transaction: ISupplierTransactions = {
          id: receipt.id,
          supplierId: supplierId || "",
          date: date,
          reference: receipt.rcp,
          transactionType: "Supplier Payment",
          description: "",
          debit: credit.toFixed(2),
          credit: "",
          balance: "",
          invId: "",
        };

        try {
          if (me?.property && me?.year)
            await api.body.supplier_transactions.create(
              supplier_transaction,
              me?.property,
              me?.year,
              receipt.id
            );
        } catch (error) {
          console.log(error);
        }

        console.log("Balance updated successfully");
      } else {
        console.log("Docuemnt not found");
      }
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
        await api.body.receiptPayments.getAll(me.property, me?.year);
        const rcp = store.bodyCorperate.receiptsPayments.all
          .sort(
            (a, b) =>
              new Date(b.asJson.date).getTime() -
              new Date(a.asJson.date).getTime()
          )
          .sort(
            (a, b) =>
              new Date(b.asJson.date).getTime() -
              new Date(a.asJson.date).getTime()
          )
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
      await api.body.receiptPayments.getAll(me.property, me?.year);
      const rcp = store.bodyCorperate.receiptsPayments.all
        .filter((rcp) => rcp.asJson.transactionType === "Supplier Payment")
        .map((rcp) => {
          return rcp.asJson;
        });
      setRCP(rcp);
    }
  };

  const suppliers = store.bodyCorperate.supplier.all.map((inv) => {
    return inv.asJson;
  });
  const accounts = store.bodyCorperate.account.all.map((a) => {
    return a.asJson;
  });

  const totalCredits = rcp.reduce(
    (debit, rcp) => debit + parseInt(rcp.credit),
    0
  );

  const formattedCredit = nadFormatter.format(totalCredits);

  //confirm dialog
  const toast = useRef<Toast>(null);

  const accept = () => {
    createPayment();
    toast.current?.show({
      severity: "info",
      summary: "Payment successfully created",
      detail: "Supplier Payment",
      life: 3000,
    });
  };

  const reject = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Payment Not Created",
      detail: "Supplier Payment Not created",
      life: 3000,
    });
    hideModalFromId(DIALOG_NAMES.BODY.CREATE_SUPPLIER_PAYMENT);
  };

  const confirm = (position: any) => {
    confirmDialog({
      message: "Do you want to create a Supplier Payment?",
      header: "Supplier Payment Confirmation",
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
            <span className="uk-width-1-2-right" style={{ fontSize: "18px" }}>
              <ArrowCircleUpSharpIcon style={{ color: "red" }} /> Total
              Outflows: {formattedCredit}
            </span>
          </div>
        }
        rightControls={
          <div>
            <IconButton uk-tooltip="Create Supplier Payment" onClick={onCreate}>
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
      <PaymentGrid data={rcp} />

      <Modal modalId={DIALOG_NAMES.BODY.CREATE_SUPPLIER_PAYMENT}>
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
            Create supplier payment
          </h4>
          <div className="uk-grid-small" data-uk-grid>
            <div className="uk-width-1-2">
              <label>Supplier</label>
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
            <div className="uk-width-1-2">
              <label>date</label>
              <input
                className="uk-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="uk-width-1-2">
              <label>Reference</label>
              <input
                className="uk-input"
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className="uk-width-1-2">
              <label>Select Acount</label>
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
            <div className="uk-width-1-2">
              <label>Description</label>
              <input
                className="uk-input"
                type="text"
                value={description}
                onChange={(e) => setDescriptioin(e.target.value)}
              />
            </div>
            <div className="uk-width-1-2">
              <label>Credit</label>
              <NumberInput
                value={credit}
                onChange={(e) => setCredit(Number(e))}
              />
            </div>

            <IconButton onClick={() => confirm("right")}>
              <SaveIcon />
            </IconButton>
            {loading && <p>loading...</p>}
          </div>
        </div>
      </Modal>
      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
});

export default SupplierPayment;
