import { observer } from "mobx-react-lite";
import {
  IReceiptsPayments,
  defaultReceiptsPayments,
} from "../../../../../../../shared/models/receipts-payments/ReceiptsPayments";
import { useAppContext } from "../../../../../../../shared/functions/Context";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../../../shared/models/bcms/BodyCorperate";
import {
  ISupplier,
  defaultSupplier,
} from "../../../../../../../shared/models/Types/Suppliers";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../../../dialogs/Dialogs";
import { ISupplierInvoices } from "../../../../../../../shared/models/invoices/SupplierInvoice";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../../../shared/database/FirebaseConfig";
import {
  FailedAction,
  SuccessfulAction,
} from "../../../../../../../shared/models/Snackbar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Modal from "../../../../../../../shared/components/Modal";
import NumberInput from "../../../../../../../shared/functions/number-input/NumberInput";
import { ISupplierTransactions } from "../../../../../../../shared/models/transactions/supplier-transactions/SupplierTransactions";

interface IProp {
  data: IReceiptsPayments[];
  supplierId: string;
}

interface ServiceDetails {
  description: string;
  qty: number;
  price: number;
  total: number;
}

export const PaymentGrid = observer(({ data, supplierId }: IProp) => {
  const { store, api, ui } = useAppContext();
  const navigate = useNavigate();
  const me = store.user.meJson;
  const [transactionId, setTransactionId] = useState<string[]>([]);

  const handleCheckboxChange = (event: any, id: string) => {
    if (event.target.checked) {
      setTransactionId((prevIds) => [...prevIds, id]);
    } else {
      setTransactionId((prevIds) => prevIds.filter((prevId) => prevId !== id));
    }
  };

  const currentDate = new Date();
  const currentDate1 = new Date().toISOString().slice(0, 10);
  const [selectedDateIssued, setSelectedDateIssued] = useState(currentDate1);
  const [selectedDate, setSelectedDate] = useState(currentDate1);
  const [supplier, setSupplier] = useState<ISupplier | undefined>({
    ...defaultSupplier,
  });

  useEffect(() => {
    const getProperty = async () => {
      await api.body.body.getAll();
      if (me?.property) await api.body.supplier.getAll(me.property);
      const supplier = store.bodyCorperate.supplier.getById(supplierId);
      setSupplier(supplier?.asJson);
    };
    getProperty();
  }, [
    api.body.body,
    api.body.supplier,
    store.bodyCorperate.bodyCop,
    store.bodyCorperate.supplier,
    supplierId,
    me?.property,
  ]);

  //create invoice
  // invoice
  const createInvoice = () => {
    showModalFromId(DIALOG_NAMES.BODY.CREATE_INVOICE);
  };

  // generate invoice number

  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    // Generate the invoice number
    const generateInvoiceNumber = () => {
      const randomNumber = Math.floor(Math.random() * 100000); // Generate a random number between 0 and 9999
      const formattedNumber = randomNumber.toString().padStart(4, "0"); // Pad the number with leading zeros if necessary
      const generatedInvoiceNumber = `SIV000${formattedNumber}`; // Add the prefix "INV" to the number
      setInvoiceNumber(generatedInvoiceNumber); // Update the state with the generated invoice number
    };
    generateInvoiceNumber(); // Generate the invoice number when the component mounts
    // Clean up the effect (optional)
    return () => {
      // Any cleanup code if necessary
    };
  }, []);

  const [details, setDetails] = useState<ServiceDetails[]>([]);
  const totalPrice = details.reduce((sum, detail) => sum + detail.price, 0);

  const [description, setDescription] = useState("");
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);

  const addDetails = () => {
    // Create a new object with the retrieved values
    const newDetail: ServiceDetails = {
      description: description,
      qty: qty,
      price: price,
      total: total,
    };

    // Update the state by adding the new detail to the existing details array
    setDetails((prevDetails) => [...prevDetails, newDetail]);
    // Reset the input fields to their initial states
    setDescription("");
    setQty(0);
    setPrice(0);
    setTotal(0);
  };

  const [loadingInvoice, setLoadingInvoice] = useState(false);
  // submitting invoice
  const onSaveInvoice = async (e: any) => {
    e.preventDefault();
    setLoadingInvoice(true);
    const InvoiceData: ISupplierInvoices = {
      invoiceId: "",
      yearId: "",
      invoiceNumber: invoiceNumber,
      dateIssued: selectedDateIssued,
      dueDate: selectedDate,
      references: "",
      totalDue: totalPrice,
      serviceId: details,
      confirmed: false,
      verified: false,
      reminder: false,
      reminderDate: "",
      totalPaid: 0,
      propertyId: me?.property || "",
      supplierId: supplier?.id || "",
    };
    try {
      if (me?.property && me.year)
        await api.body.supplierInvoice.create(
          InvoiceData,
          me.property,
          me.year
        );

      const id = InvoiceData.invoiceId;
      //supplier transaction created here

      //update supplierBalance
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
          const supplierNewBalance = supplierBalance + totalPrice;
          await updateDoc(supplierRef, { balance: supplierNewBalance });

          const supplier_transaction: ISupplierTransactions = {
            id: "",
            supplierId: supplier?.id || "",
            date: selectedDateIssued,
            reference: invoiceNumber,
            transactionType: "Supplier Invoice",
            description: "",
            debit: "",
            credit: totalPrice.toFixed(2),
            balance: supplierBalance + Math.abs(supplierBalance) + totalPrice,
            invId: InvoiceData.invoiceId,
          };

          try {
            if (me?.property && me?.year)
              await api.body.supplier_transactions.create(
                supplier_transaction,
                me?.property,
                me?.year
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

      //add invoice to receipts and payemnts
      addInvoiceNumber(InvoiceData.invoiceNumber, InvoiceData.invoiceId);
      SuccessfulAction(ui);
    } catch (error) {
      FailedAction(ui);
    }

    setLoadingInvoice(false);
    setInvoiceNumber("");
    // setSelectedDate("");
    hideModalFromId(DIALOG_NAMES.BODY.CREATE_INVOICE);
    navigate("/c/accounting/supplier-invoices");
  };

  const calculateTotalCredit = async () => {
    const receiptsAndPaymentsPath = `/BodyCoperate/${me?.property}/FinancialYear/${me?.year}/Months/${me?.month}`;
    const creditSum = 0;
  };

  const addInvoiceNumber = async (invoiceNumber: string, invoiceId: string) => {
    try {
      const receiptsAndPaymentsPath = `/BodyCoperate/${me?.property}/FinancialYear/${me?.year}`;
      const supplierPath = `/BodyCoperate/${me?.property}/FinancialYear/${me?.year}/`;

      let creditSum = 0; // Initialize the sum of credits

      // Use a for loop to iterate through transactionId array
      for (const id of transactionId) {
        const fnbStatementsRef = doc(
          collection(db, receiptsAndPaymentsPath, "ReceiptsPayments"),
          id
        );
        const transactionsRef = doc(
          collection(db, receiptsAndPaymentsPath, "SupplierTransactions"),
          id
        );

        const fnbStatementsSnapshot = await getDoc(fnbStatementsRef);
        const transactionsSnapshot = await getDoc(transactionsRef);

        if (fnbStatementsSnapshot.exists() && transactionsSnapshot.exists()) {
          const credit = fnbStatementsSnapshot.data().credit || 0;
          creditSum += parseFloat(credit); // Assuming credit is a string representation of a number
          await updateDoc(fnbStatementsRef, {
            invoiceNumber: invoiceId,
          });
          await updateDoc(transactionsRef, {
            invId: invoiceId,
          });

          const supplierRef = doc(
            collection(db, supplierPath, "SupplierInvoices"),
            invoiceId
          );
          const supplierSnapShot = await getDoc(supplierRef);
          try {
            if (supplierSnapShot.exists()) {
              await updateDoc(supplierRef, {
                totalPaid: creditSum,
              });
            }
          } catch (error) {
            FailedAction(error);
          }
        } else {
          console.log("ReceiptsPayments document not found.");
        }
      }

      // Now, creditSum contains the sum of credits from all ReceiptsPayments documents
      console.log("Sum of credits:", creditSum);

      SuccessfulAction(ui);
      window.location.reload();
    } catch (error) {
      console.error("Error updating invoice numbers:", error);
      FailedAction(ui);
    }
  };

  // create the invoice
  //update transaction with supplier invoiceNumber

  const columns: GridColDef[] = [
    { field: "invoiceNumber", headerName: "InvoiceNumber", width: 130 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "description", headerName: "Description", width: 130 },
    {
      field: "reference",
      headerName: "Reference",
      width: 170,
    },
    { field: "debit", headerName: "Debit", width: 130 },
    { field: "credit", headerName: "Credit", width: 130 },
    { field: "balance", headerName: "Balance", width: 130 },
    {
      field: "Action",
      headerName: "Action",
      width: 140,
      renderCell: (params) => (
        <div>
          <input
            type="checkbox"
            className="uk-checkbox"
            onChange={(e) => handleCheckboxChange(e, params.row.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ height: 300 }} className="companies-grid">
        <DataGrid
          rows={data}
          //   columns={column}
          columns={columns}
          getRowId={(row) => row.id}
          rowHeight={50}
        />
      </Box>
      <button className="uk-button primary uk-margin" onClick={createInvoice}>
        Create Invoice
      </button>

      <Modal modalId={DIALOG_NAMES.BODY.CREATE_INVOICE}>
        <div
          className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
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
                <div className="uk-width-1-3@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Invoice Number</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input "
                        type="text"
                        value={invoiceNumber}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-3@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Date</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input "
                        type="date"
                        value={selectedDateIssued}
                        onChange={(e) => setSelectedDateIssued(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-3@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Due Date</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input "
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <h3 className="uk-modal-title">Total Due</h3>
                <p style={{ fontWeight: "600" }}>N$ {totalPrice.toFixed(2)}</p>

                <h3 className="uk-modal-title">Service(s) details</h3>
                <div className="uk-width-1-3@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Description</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input "
                        type="text"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="uk-width-1-3@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">QTY</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input "
                        type="text"
                        required
                        onChange={(e) => setQty(Number(e.target.value))}
                        value={qty}
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-3@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Price</label>
                    <div className="uk-form-controls">
                      <NumberInput
                        value={price}
                        onChange={(e) => setPrice(Number(e))}
                      />
                      {/* <input
                        className="uk-input "
                        type="text"
                        required
                        onChange={(e) => setPrice(Number(e.target.value))}
                        value={price}
                      /> */}
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
                        <td>N$ {details.price.toFixed(2)}</td>
                        <td>N$ {details.price.toFixed(2)}</td>
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
    </>
  );
});
