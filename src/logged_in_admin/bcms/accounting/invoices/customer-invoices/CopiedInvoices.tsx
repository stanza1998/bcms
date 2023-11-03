import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useEffect, useState } from "react";
import InvoicesGrid from "./invoices-grid";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";
import Toolbar2 from "../../../../shared/Toolbar2";
import { nadFormatter } from "../../../../shared/NADFormatter";
import ArrowCircleUpSharpIcon from "@mui/icons-material/ArrowCircleUpSharp";
import ArrowCircleDownSharpIcon from "@mui/icons-material/ArrowCircleDownSharp";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Modal from "../../../../../shared/components/Modal";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import { SuccessfulAction } from "../../../../../shared/models/Snackbar";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../shared/database/FirebaseConfig";
import { ICustomerTransactions } from "../../../../../shared/models/transactions/customer-transactions/CustomerTransactionModel";
import { ICopiedInvoice } from "../../../../../shared/models/invoices/CopyInvoices";

interface ServiceDetails {
  description: string;
  price: number;
  total: number;
}

export const CopiedInvoices = observer(() => {
  const { store, api, ui } = useAppContext();
  const me = store.user.meJson;
  const [currentDate, setCurrentDate] = useState<string>("");
  const [VAT, setVAT] = useState<boolean>(false);
  const [unitId, setUnitId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [reference, setReference] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      if (me?.property && me.year)
        await api.body.copiedInvoice.getAll(me.property, me.year);
      if (me?.property) await api.body.financialYear.getAll(me.property);
      if (me?.property && me?.year)
        await api.body.financialMonth.getAll(me.property, me.year);
      await api.auth.loadAll();
    };
    getData();
  }, [
    api.auth,
    api.body.body,
    api.body.copiedInvoice,
    api.body.financialMonth,
    api.body.financialYear,
    api.unit,
    me?.property,
    me?.year,
  ]);

  const invoicesC = store.bodyCorperate.copiedInvoices.all.map((statements) => {
    return statements.asJson;
  });

  const sortedInvoices = invoicesC.sort(
    (a, b) =>
      new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
  );

  const totalDue = invoicesC.reduce(
    (amount, invoice) => amount + invoice.totalDue,
    0
  );

  const totalPaid = invoicesC.reduce(
    (amount, invoice) => amount + invoice.totalPaid,
    0
  );

  const formattedTotalDue = nadFormatter.format(totalDue);
  const formattedTotalPaid = nadFormatter.format(totalPaid);

  //create single invoice for unit

  const onCreateInvoice = () => {
    showModalFromId(
      DIALOG_NAMES.ACCOUNTING_FINANCE_DIALOG.CRETAE_SINGLE_INVOICE
    );
  };

  //get units
  const units = store.bodyCorperate.unit.all.sort(
    (a, b) => a.asJson.unitName - b.asJson.unitName
  );

  // generate invoice number
  const [invoiceNumber, setInvoiceNumber] = useState("");
  useEffect(() => {
    // Generate the invoice number
    const generateInvoiceNumber = () => {
      const randomNumber = Math.floor(Math.random() * 10000);
      const formattedNumber = randomNumber.toString().padStart(4, "0");
      const generatedInvoiceNumber = `INV000${formattedNumber}`;
      setInvoiceNumber(generatedInvoiceNumber);
    };
    generateInvoiceNumber();
    return () => {
      // Any cleanup code if necessary
    };
  }, []);

  const [details, setDetails] = useState<ServiceDetails[]>([]);
  const totalPrice = details.reduce((sum, detail) => sum + detail.price, 0);

  //vat inclusive
  const VATINclusivePrice = (15 / 100) * totalPrice;

  const finalPrice = VATINclusivePrice + totalPrice;

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);

  const addDetails = () => {
    // Create a new object with the retrieved values
    const newDetail: ServiceDetails = {
      description: description,
      price: price,
      total: total,
    };
    // Update the state by adding the new detail to the existing details array
    setDetails((prevDetails) => [...prevDetails, newDetail]);
    // Reset the input fields to their initial states
    setDescription("");
    setPrice(0);
    setTotal(0);
  };

  const [loadingInvoice, setLoadingInvoice] = useState(false);

  //create invoice
  const onSaveInvoice = async (e: any) => {
    e.preventDefault();
    setLoadingInvoice(true);
    const InvoiceData: ICopiedInvoice = {
      invoiceId: "",
      propertyId: me?.property || "",
      unitId: unitId,
      yearId: me?.year || "",
      invoiceNumber: invoiceNumber,
      dateIssued: currentDate,
      dueDate: dueDate,
      references: "",
      totalDue: !VAT ? totalPrice : finalPrice,
      serviceId: details,
      pop: "",
      confirmed: false,
      verified: false,
      monthId: "",
      reminder: false,
      reminderDate: "",
      totalPaid: 0,
      vat: VAT,
      priceBeforeTax: totalPrice,
      vatPrice: !VAT ? 0 : VATINclusivePrice,
    };
    try {
      if (!me?.property && !me?.year) return;
      await api.body.copiedInvoice.create(InvoiceData, me?.property, me?.year);
      console.log(InvoiceData);

      setLoadingInvoice(false);
    } catch (error) {
      console.log(error);
    }

    if (me?.property) {
      const unitPath = `/BodyCoperate/${me.property}/Units/${unitId}`; // Update the unitPath to point to a specific unit
      const unitRef = doc(db, unitPath); // Removed "Units" from the path

      try {
        const unitSnapshot = await getDoc(unitRef);

        if (unitSnapshot.exists()) {
          const unitData = unitSnapshot.data();
          const balanceUpdate = unitData.balance || 0;
          const updatedBalance = balanceUpdate + InvoiceData.totalDue;
          console.log("🚀 ~ ~ before update:", balanceUpdate);

          const customerTransactionTaxInvoice: ICustomerTransactions = {
            id: "", // You may need to generate a unique ID here
            unitId: InvoiceData.unitId,
            date: InvoiceData.dateIssued,
            reference: InvoiceData.invoiceNumber,
            transactionType: "Tax Invoice",
            description: reference,
            debit: InvoiceData.totalDue.toFixed(2),
            credit: "",
            balance: updatedBalance.toFixed(2), // Use updatedBalance here instead of (totalDue + updatedBalance)
            balanceAtPointOfTime: updatedBalance.toFixed(2),
            invId: InvoiceData.invoiceId,
          };

          await api.body.customer_transactions.create(
            customerTransactionTaxInvoice,
            InvoiceData.propertyId,
            InvoiceData.yearId
          );

          await updateDoc(unitRef, { balance: updatedBalance });
        } else {
          console.error(`Unit with id ${unitId} not found`);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setInvoiceNumber("");
    setDueDate("");
    hideModalFromId(
      DIALOG_NAMES.ACCOUNTING_FINANCE_DIALOG.CRETAE_SINGLE_INVOICE
    );
    SuccessfulAction(ui);
  };

  return (
    <div>
      <Toolbar2
        leftControls={
          <div className="">
            <span className="uk-margin-right" style={{ fontSize: "18px" }}>
              <ArrowCircleDownSharpIcon style={{ color: "red" }} /> Total
              Amount: {formattedTotalDue}
            </span>
            <span style={{ fontSize: "18px" }}>
              <ArrowCircleUpSharpIcon style={{ color: "green" }} /> Total Paid:{" "}
              {formattedTotalPaid}
            </span>
          </div>
        }
        rightControls={
          <div>
            <IconButton onClick={onCreateInvoice} uk-tooltip="Create invoice">
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

      <InvoicesGrid data={sortedInvoices} />
      <Modal
        modalId={DIALOG_NAMES.ACCOUNTING_FINANCE_DIALOG.CRETAE_SINGLE_INVOICE}
      >
        <div
          className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog"
          style={{ width: "100%" }}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          <h3 className="uk-modal-title">Create Invoice</h3>
          <div className="dialog-content uk-position-relative">
            <div className="reponse-form">
              <div className="uk-grid-small uk-child-width-1-1@m" data-uk-grid>
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Unit</label>
                    <div className="uk-form-controls">
                      <select
                        onChange={(e) => setUnitId(e.target.value)}
                        className="uk-input"
                      >
                        <option value="">Select Unit</option>
                        {units.map((unit) => (
                          <option value={unit.asJson.id}>
                            Unit {unit.asJson.unitName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Invoice Number</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input"
                        type="text"
                        value={invoiceNumber}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Date</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input"
                        type="date"
                        value={currentDate}
                        onChange={(e) => setCurrentDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Due Date</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Reference</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input"
                        type="text"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <h3 className="uk-modal-title">Total Due</h3>
                <p style={{ fontWeight: "600" }}>
                  {!VAT ? (
                    <>{nadFormatter.format(totalPrice)}</>
                  ) : (
                    <>{nadFormatter.format(finalPrice)}</>
                  )}
                </p>
                <span>
                  <input
                    onChange={(e) => setVAT(e.target.checked)}
                    className="uk-checkbox"
                    type="checkbox"
                  />{" "}
                  VAT
                </span>

                <h3 className="uk-modal-title">Service(s) details</h3>
                <div className="uk-width-1-2@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Description</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input"
                        type="text"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="uk-width-1-2@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Price</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input"
                        type="text"
                        required
                        onChange={(e) => setPrice(Number(e.target.value))}
                        value={price}
                      />
                    </div>
                  </div>
                </div>

                {description && price > 0 && (
                  <div className="uk-width-1-2@m">
                    <div className="uk-margin">
                      <div className="uk-form-controls">
                        <button
                          className="uk-button primary"
                          onClick={addDetails}
                        >
                          Add To List
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <table className="uk-table uk-table-small uk-table-divider">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((details, index) => (
                      <tr key={index}>
                        <td style={{ textTransform: "uppercase" }}>
                          {details.description}
                        </td>
                        <td>{nadFormatter.format(details.price)}</td>
                        <td>{nadFormatter.format(details.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="footer uk-margin">
                <button className="uk-button secondary uk-modal-close">
                  Cancel
                </button>
                <button className="uk-button primary" onClick={onSaveInvoice}>
                  Save
                  {loadingInvoice && <div data-uk-spinner="ratio: .5"></div>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
});
