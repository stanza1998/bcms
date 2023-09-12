import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { IFNB } from "../../../../../../shared/models/banks/FNBModel";
import { useNavigate } from "react-router-dom";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../../dialogs/Dialogs";
import {
  FailedAction,
  SuccessfulAction,
} from "../../../../../../shared/models/Snackbar";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../../shared/database/FirebaseConfig";
import { ISupplierInvoices } from "../../../../../../shared/models/invoices/SupplierInvoice";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Modal from "../../../../../../shared/components/Modal";
import { Box } from "@mui/material";
import { IReceiptsPayments } from "../../../../../../shared/models/receipts-payments/ReceiptsPayments";

export const FNBCreate = observer(() => {
  const { store, api } = useAppContext();
  const [supplierId, setSupplierId] = useState<string>("");
  const me = store.user.meJson;

  useEffect(() => {
    const getData = async () => {
      if (me?.property && !me?.year && !me?.month)
        await api.body.fnb.getAll(me.property, me.year, me.month);
      await api.body.body.getAll();
      if (me?.property) await api.body.supplier.getAll(me.property);
    };
    getData();
  }, [me?.property, me?.year, me?.month]);

  const accounts = store.bodyCorperate.supplier.all.map((p) => {
    return p.asJson;
  });

  const transactions = store.bodyCorperate.receiptsPayments.all
    .filter(
      (t) =>
        t.asJson.propertyId === me?.property &&
        t.asJson.supplierId === supplierId
    )
    .map((t) => {
      return t.asJson;
    });

  return (
    <div>
      <div>
        <label htmlFor="">Select Supplier Account</label>
        <br />
        <select
          name=""
          id=""
          className="uk-input"
          onChange={(e) => setSupplierId(e.target.value)}
          style={{ width: "30%" }}
        >
          <option value="">Select Supplier Account</option>
          {accounts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} , {p.description}
            </option>
          ))}
        </select>
      </div>
      <br />
      <br />
      <FNBGrid supplierId={supplierId} data={transactions} />
    </div>
  );
});

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

const FNBGrid = observer(({ data, supplierId }: IProp) => {
  const { store, api, ui } = useAppContext();
  const navigate = useNavigate();
  const currentDate1 = new Date().toISOString().slice(0, 10);
  const [selectedDateIssued, setSelectedDateIssued] = useState(currentDate1);
  const [selectedDate, setSelectedDate] = useState(currentDate1);
  const me = store.user.meJson;
  const [transactionId, setTransactionId] = useState<string[]>([]);

  const handleCheckboxChange = (event: any, id: string) => {
    if (event.target.checked) {
      setTransactionId((prevIds) => [...prevIds, id]);
    } else {
      setTransactionId((prevIds) => prevIds.filter((prevId) => prevId !== id));
    }
  };

  useEffect(() => {
    const getProperty = async () => {
      await api.body.body.getAll();
      if (me?.property) await api.body.supplier.getAll(me.property);
      if (me?.property && me?.year && me?.month)
        await api.body.fnb.getAll(me.property, me.year, me.month);
    };
    getProperty();
  }, []);

  //create invoice
  const createInvoice = () => {
    showModalFromId(DIALOG_NAMES.BODY.CREATE_INVOICE);
  };

  const [invoiceNumber, setInvoiceNumber] = useState("");

  useEffect(() => {
    const generateInvoiceNumber = () => {
      const randomNumber = Math.floor(Math.random() * 100000);
      const formattedNumber = randomNumber.toString().padStart(4, "0");
      const generatedInvoiceNumber = `SIV000${formattedNumber}`;
      setInvoiceNumber(generatedInvoiceNumber);
    };
    generateInvoiceNumber();

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
      supplierId: supplierId,
    };
    try {
      if (me?.property && me.year) {
        await api.body.supplierInvoice.create(
          InvoiceData,
          me.property,
          me.year
        );

        const supplierPath = `BodyCoperate/${me.property}`;
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

          console.log("Balance updated successfully");
        } else {
          console.log("Docuemnt not found");
        }
        addInvoiceNumber(InvoiceData.invoiceNumber);
        SuccessfulAction(ui);
      }
    } catch (error) {
      FailedAction(ui);
    }

    setLoadingInvoice(false);
    setInvoiceNumber("");
    setSelectedDate("");
    hideModalFromId(DIALOG_NAMES.BODY.CREATE_INVOICE);
    navigate("/c/accounting/supplier-invoices");
  };

  const addInvoiceNumber = (invoiceNumber: string) => {
    const myPath = `/BodyCoperate/${me?.property}/FinancialYear/${me?.year}/Months/${me?.month}`;
    transactionId.forEach(async (ids) => {
      const fnbStatementsRef = doc(
        collection(db, myPath, "FNBTransactions"),
        ids
      );
      const fnbStatementsSnapshot = await getDoc(fnbStatementsRef);
      if (fnbStatementsSnapshot.exists()) {
        await updateDoc(fnbStatementsRef, {
          invoiceNumber: invoiceNumber,
        });
        SuccessfulAction(ui);
        window.location.reload();
      } else {
        console.log("NedBankStatements document not found.");
        FailedAction(ui);
      }
    });
  };

  //update transaction with supplier invoiceNumber

  const columns: GridColDef[] = [
    { field: "invoiceNumber", headerName: "InvoiceNumber", width: 150 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    {
      field: "reference",
      headerName: "Reference",
      width: 150,
    },
    { field: "transactionType", headerName: "Transaction Type", width: 150 },
    { field: "debit", headerName: "Debit", width: 150 },
    { field: "credit", headerName: "Credit", width: 150 },
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
          rowHeight={40}
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
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Property Name</label>
                    <div className="uk-form-controls">
                      <input
                        id="first-name"
                        className="uk-input uk-form-small"
                        type="text"
                        value={store.bodyCorperate.bodyCop.all
                          .filter((p) => p.asJson.id === me?.property)
                          .map((p) => {
                            return p.asJson.BodyCopName;
                          })}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Invoice Number</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input uk-form-small"
                        type="text"
                        value={invoiceNumber}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Reference</label>
                    <div className="uk-form-controls">
                      <input
                        id="first-name"
                        className="uk-input uk-form-small"
                        type="text"
                        // value={property?.BodyCopName}
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
                        className="uk-input uk-form-small"
                        type="date"
                        value={selectedDateIssued}
                        onChange={(e) => setSelectedDateIssued(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="uk-width-1-5@m">
                  <div className="uk-margin">
                    <label className="uk-form-label">Due Date</label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input uk-form-small"
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
                        className="uk-input uk-form-small"
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
                        className="uk-input uk-form-small"
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
                      <input
                        className="uk-input uk-form-small"
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
