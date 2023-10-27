import IconButton from "@mui/material/IconButton";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { IFNB } from "../../../../../shared/models/banks/FNBModel";
import { Box } from "@mui/material";
import { useAppContext } from "../../../../../shared/functions/Context";
import { doc, collection, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../shared/database/FirebaseConfig";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import {
  SuccessfulAction,
  FailedAction,
  SuccessfulActionCustomerReceipt,
  SuccessfulActionSupplierPayment,
} from "../../../../../shared/models/Snackbar";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { ICopiedInvoice } from "../../../../../shared/models/invoices/CopyInvoices";
import Modal from "../../../../../shared/components/Modal";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import { INormalAccount } from "../../../../../shared/models/Types/Account";
import { ISupplier } from "../../../../../shared/models/Types/Suppliers";
import { ITransfer } from "../../../../../shared/models/Types/Transfer";
import {
  IReceiptsPayments,
  defaultReceiptsPayments,
} from "../../../../../shared/models/receipts-payments/ReceiptsPayments";
import { IBankingTransactions } from "../../../../../shared/models/banks/banking/BankTransactions";
import SingleSelect from "../../../../../shared/components/single-select/SlingleSelect";

interface IProp {
  data: IFNB[];
  rerender: () => void;
}

const FNBDataGrid = observer(({ data, rerender }: IProp) => {
  const { store, api, ui } = useAppContext();
  const [unitId, setUnit] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");
  const [transferId, setTransferId] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [invoiceCopied, setInvoiceCopied] = useState<ICopiedInvoice[]>([]);
  const me = store.user.meJson;

  // Generate the rcp number
  const generateInvoiceNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const formattedNumber = randomNumber.toString().padStart(4, "0");
    const generatedInvoiceNumber = `RCP000${formattedNumber}`;
    return generatedInvoiceNumber;
  };

  //generate pay number
  const generateInvoiceNumberSupplier = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const formattedNumber = randomNumber.toString().padStart(4, "0");
    const generatedInvoiceNumber = `PAYP000${formattedNumber}`;
    return generatedInvoiceNumber;
  };

  useEffect(() => {
    const getStatements = async () => {
      if (!me?.property && !me?.year && !me?.month) return;
      // Otherwise, fetch data and cache it
      await Promise.all([
        api.body.fnb.getAll(me.property, me.year, me.month),
        api.body.body.getAll(),
        api.unit.getAll(me.property),
        api.body.copiedInvoice.getAll(me.property, me.year),
        api.body.account.getAll(me.property),
        api.body.transfer.getAll(me.property),
        api.body.supplier.getAll(me.property),
      ]);
    };

    getStatements();
  }, [me?.property, me?.year, me?.month]);

  const onAllocate = (
    unitId: string,
    transactionId: string,
    amount: number
  ) => {
    const invoicesCopied = store.bodyCorperate.copiedInvoices.all
      .filter((inv) => inv.asJson.unitId === unitId)
      .map((inv) => {
        return inv.asJson;
      });

    setInvoiceCopied(invoicesCopied);
    setTransactionId(transactionId);
    setAmount(amount);
    showModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
  };

  const [isAllocating, setIsAllocating] = useState(false);

  const updateStatement = async (
    id: string,
    invoiceNumber: string,
    transactionId: string,
    unitId: string,
    amount: number
  ) => {
    try {
      setIsAllocating(true);
      const copiedInvoicesPath = `/BodyCoperate/${me?.property}/FinancialYear/${me?.year}`;
      const invoiceRef = doc(
        collection(db, copiedInvoicesPath, "CopiedInvoices"),
        id
      );
      const invoiceSnapshot = await getDoc(invoiceRef);
      if (invoiceSnapshot.exists()) {
        const invoiceData = invoiceSnapshot.data();
        const existingTotalPaid = invoiceData.totalPaid || 0; // Default to 0 if totalPaid doesn't exist
        const updatedTotalPaid = existingTotalPaid + amount;
        await updateDoc(invoiceRef, {
          totalPaid: updatedTotalPaid,
        });
      } else {
        console.log("Invoice not found.");
        return; // Return early if the invoice doesn't exist
      }

      const unitPath = `/BodyCoperate/${me?.property}/`;
      const unitRef = doc(collection(db, unitPath, "Units"), unitId);
      const unitSnaphot = await getDoc(unitRef);
      if (unitSnaphot.exists()) {
        const unitData = unitSnaphot.data();
        const balanceUpdate = unitData.balance || 0;
        const updatedBalance = balanceUpdate - amount;
        await updateDoc(unitRef, { balance: updatedBalance });
      }

      const transactionsPath = `BodyCoperate/${me?.property}/FinancialYear/${me?.year}`;
      const transactionsCollectionRef = doc(
        collection(db, transactionsPath, "FNBTransactions"),
        transactionId
      );
      const fnbStatementsSnapshot = await getDoc(transactionsCollectionRef);
      if (fnbStatementsSnapshot.exists()) {
        await updateDoc(transactionsCollectionRef, {
          allocated: true,
          unitId: unitId,
          invoiceNumber: invoiceNumber,
          rcp: generateInvoiceNumber(),
        });
        SuccessfulAction(ui);
        setIsAllocating(false);
      } else {
        console.log(" document not found.");
        FailedAction(ui);
      }
    } catch (error) {
      FailedAction(ui);
    } finally {
      const trans = store.bodyCorperate.fnb.getById(transactionId);
      const rs: IReceiptsPayments = {
        id: "",
        date: trans?.asJson.date || "",
        reference: trans?.asJson.references || "",
        transactionType: "Customer Receipt",
        description: trans?.asJson.description || "",
        debit: trans?.asJson.amount.toFixed(2) || "",
        credit: "",
        balance: trans?.asJson.balance.toFixed(2) || "",
        propertyId: trans?.asJson.propertyId || "",
        unitId: trans?.asJson.unitId || "",
        invoiceNumber: trans?.asJson.invoiceNumber || "",
        rcp: trans?.asJson.rcp || "",
        supplierId: trans?.asJson.supplierId || "",
      };

      if (!me?.property && !me?.year && !me?.month)
        return FailedAction("NOT FOUND");
      try {
        await api.body.receiptPayments.create(rs, me.property, me.year);
      } catch (error) {
        console.log(error);
      } finally {
        SuccessfulActionCustomerReceipt(ui);
      }

      const bank_transaction: IBankingTransactions = {
        id: "",
        date: trans?.asJson.date || "",
        payee: unitId,
        description: trans?.asJson.description || "",
        type: "Customer",
        selection: accountId,
        reference: trans?.asJson.references || "",
        VAT: "Exempted",
        credit: "",
        debit: Math.abs(amount).toFixed(2),
      };

      try {
        if (me?.property && me?.bankAccountInUse)
          await api.body.banking_transaction.create(
            bank_transaction,
            me.property,
            me.bankAccountInUse
          );
        console.log("transaction created");
        setAccountId("");
      } catch (error) {
        console.log(error);
      }

      setIsAllocating(false);
      setUnit("");
      rerender();
      hideModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
    }
  };

  const updateAccount = async (id: string, amount: number) => {
    if (accountId === "") {
      FailedAction(ui);
      setAccountId("");
      setTransferId("");
      setSupplierId("");
      return;
    } else {
      const myPath1 = `BodyCoperate/${me?.property}/FinancialYear/${me?.year}`;
      const transactionsCollectionRef = doc(
        collection(db, myPath1, "FNBTransactions"),
        id
      );
      const fnbStatementsSnapshot = await getDoc(transactionsCollectionRef);
      if (fnbStatementsSnapshot.exists()) {
        await updateDoc(transactionsCollectionRef, {
          allocated: true,
          accountId: accountId,
          rcp: generateInvoiceNumber(),
        });
        setIsAllocating(false);
        SuccessfulAction(ui);
        setAccountId("");
        setTransferId("");
        setSupplierId("");
      } else {
        console.log("FnbStatements document not found.");
        FailedAction(ui);
      }

      const trans = store.bodyCorperate.fnb.getById(id);
      const bank_transaction: IBankingTransactions = {
        id: "",
        date: trans?.asJson.date || "",
        payee: accountId,
        description: trans?.asJson.description || "",
        type: "Account",
        selection: accountId,
        reference: trans?.asJson.references || "",
        VAT: "Exempted",
        credit: amount < 0 ? Math.abs(amount).toFixed(2) : "",
        debit: amount > 0 ? amount.toFixed(2) : "",
      };
      try {
        if (me?.property && me?.bankAccountInUse)
          await api.body.banking_transaction.create(
            bank_transaction,
            me.property,
            me.bankAccountInUse
          );
        console.log("transaction created");
        setAccountId("");
      } catch (error) {
        console.log(error);
      }

      //general ledge info
      rerender();
    }
  };

  const onAllocateSupplier = (id: string, amount: number) => {
    setTransactionId(id);
    setAmount(amount);
    showModalFromId(DIALOG_NAMES.BODY.CREATE_ALLOCATE_SUPPLIER);
  };

  const updateSupplier = async () => {
    setIsAllocating(true);
    try {
      if (supplierId === "") {
        FailedAction(ui);
        setAccountId("");
        setTransferId("");
        setSupplierId("");
        return;
      } else {
        const myPath1 = `BodyCoperate/${me?.property}/FinancialYear/${me?.year}`;
        const transactionsCollectionRef = doc(
          collection(db, myPath1, "FNBTransactions"),
          transactionId
        );
        const fnbStatementsSnapshot = await getDoc(transactionsCollectionRef);
        if (fnbStatementsSnapshot.exists()) {
          await updateDoc(transactionsCollectionRef, {
            allocated: true,
            supplierId: supplierId,
            rcp: generateInvoiceNumberSupplier(),
          });
          setIsAllocating(false);
          setAccountId("");
          setTransferId("");
          setSupplierId("");
          SuccessfulAction(ui);
        } else {
          console.log("FnbStatements document not found.");
          FailedAction(ui);
        }
        rerender();
      }
    } catch (error) {
      console.log(error);
    } finally {
      const trans = store.bodyCorperate.fnb.getById(transactionId);
      const rs: IReceiptsPayments = {
        id: "",
        date: trans?.asJson.date || "",
        reference: trans?.asJson.references || "",
        transactionType: "Supplier Payment",
        description: trans?.asJson.description || "",
        debit: "",
        credit: Math.abs(trans?.asJson.amount || 0).toFixed(2) || "",
        balance: trans?.asJson.balance.toFixed(2) || "",
        propertyId: trans?.asJson.propertyId || "",
        unitId: trans?.asJson.unitId || "",
        invoiceNumber: trans?.asJson.invoiceNumber || "",
        rcp: trans?.asJson.rcp || "",
        supplierId: trans?.asJson.supplierId || "",
      };

      if (!me?.property && !me?.year && !me?.month)
        return FailedAction("NOT FOUND");
      try {
        await api.body.receiptPayments.create(rs, me.property, me.year);
      } catch (error) {
        console.log(error);
      } finally {
        SuccessfulActionSupplierPayment(ui);
      }
      const bank_transaction: IBankingTransactions = {
        id: "",
        date: trans?.asJson.date || "",
        payee: supplierId,
        description: accountId,
        type: "Supplier",
        selection: accountId,
        reference: trans?.asJson.references || "",
        VAT: "Exempted",
        credit: Math.abs(amount).toFixed(2),
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
        setAccountId("");
      } catch (error) {
        console.log(error);
      }

      try {
        const supplierPath = `BodyCoperate/${me.property}`;
        const supplierRef = doc(
          collection(db, supplierPath, "Suppliers"),
          supplierId
        );

        const supplierSnapShot = await getDoc(supplierRef);
        if (supplierSnapShot.exists()) {
          const supplierData = supplierSnapShot.data();
          const supplierBalance = supplierData.balance || 0;
          const supplierNewBalance = supplierBalance + amount;
          await updateDoc(supplierRef, { balance: supplierNewBalance });

          console.log("Balance updated successfully");
        } else {
          console.log("Docuemnt not found");
        }
      } catch (error) {
        console.log(error);
      }
    }
    setIsAllocating(false);
    hideModalFromId(DIALOG_NAMES.BODY.CREATE_ALLOCATE_SUPPLIER);
  };

  //create accounts
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mobile, setMobile] = useState("");
  const [tel, setTel] = useState("");
  const [balance, setBalance] = useState(0);

  const onCreateAccount = () => {
    showModalFromId(DIALOG_NAMES.BODY.CREATE_INVOICE);
  };
  const onCreateSupplier = () => {
    showModalFromId(DIALOG_NAMES.BODY.BODY_UNIT_DIALOG);
  };

  const clear = () => {
    setName("");
    setDescription("");
  };

  const [createLoader, setCreateLOader] = useState(false);

  const createAccount = async (e: any) => {
    e.preventDefault();
    setCreateLOader(true);
    const Account: INormalAccount = {
      id: "",
      name: name,
      description: description,
      category: "",
      balance: 0,
    };
    try {
      if (me?.property) await api.body.account.create(Account, me.property);
      SuccessfulAction(ui);
    } catch (error) {
      FailedAction(error);
    }
    setCreateLOader(false);
    setName("");
    setDescription("");
    hideModalFromId(DIALOG_NAMES.BODY.CREATE_INVOICE);
  };

  const createSupplier = async (e: any) => {
    e.preventDefault();
    setCreateLOader(true);
    const Account: ISupplier = {
      id: "",
      name: name,
      description: description,
      balance: balance,
      mobileNumber: mobile,
      telephoneNumber: tel,
    };
    try {
      if (me?.property) await api.body.supplier.create(Account, me.property);
      SuccessfulAction(ui);
    } catch (error) {
      FailedAction(error);
    }
    setCreateLOader(false);
    setName("");
    setDescription("");
    hideModalFromId(DIALOG_NAMES.BODY.BODY_UNIT_DIALOG);
  };

  const createTransfer = async (e: any) => {
    e.preventDefault();
    setCreateLOader(true);
    const Account: ITransfer = {
      id: "",
      name: name,
      description: description,
    };
    try {
      if (me?.property) await api.body.transfer.create(Account, me.property);
      SuccessfulAction(ui);
    } catch (error) {
      FailedAction(error);
    }
    setCreateLOader(false);
    setName("");
    setDescription("");
    hideModalFromId(DIALOG_NAMES.BODY.FINANCIAL_MONTH);
  };

  const column: GridColDef[] = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "serviceFee", headerName: "Service Fee", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "references", headerName: "Reference", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "balance", headerName: "Balance", flex: 1 },
    {
      field: "Type ",
      headerName: "Type",
      flex: 1,
      renderCell: (params) => (
        <div style={{ width: "100%" }}>
          <select
            onChange={(e) => setType(e.target.value)}
            style={{ width: "100%" }}
            name=""
            id=""
            className="uk-input uk-form-small"
          >
            <option value="">Select</option>
            <option value="Account">Account</option>
            <option value="Supplier">Supplier</option>
            <option value="Customer">Customer</option>
            {/* <option value="Transfer">Transfer</option> */}
          </select>
        </div>
      ),
    },
    {
      field: "Selection ",
      headerName: "Selection",
      flex: 1,
      renderCell: (params) => (
        <div style={{ width: "100%" }}>
          {type === "Account" && (
            <>
              <select
                style={{ width: "82%" }}
                name=""
                id=""
                className="uk-input uk-form-small"
                onChange={(e) => setAccountId(e.target.value)}
              >
                <option value="">Select Account</option>
                {store.bodyCorperate.account.all.map((a) => (
                  <option value={a.asJson.id}>
                    {a.asJson.name} , {a.asJson.description}
                  </option>
                ))}
              </select>
              <IconButton onClick={onCreateAccount}>
                <AddCircleOutlineIcon />
              </IconButton>
            </>
          )}
          {type === "Supplier" && (
            <>
              <select
                style={{ width: "82%" }}
                name=""
                id=""
                className="uk-input uk-form-small"
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option value="">Select Account</option>
                {store.bodyCorperate.supplier.all.map((a) => (
                  <option value={a.asJson.id}>
                    {a.asJson.name} , {a.asJson.description}
                  </option>
                ))}
              </select>
              <IconButton onClick={onCreateSupplier}>
                <AddCircleOutlineIcon />
              </IconButton>
            </>
          )}
          {type === "Customer" && (
            <select
              style={{ width: "100%" }}
              name=""
              id=""
              className="uk-input uk-form-small"
              onChange={(e) => setUnit(e.target.value)}
            >
              <option value="">Select Account</option>
              {store.bodyCorperate.unit.all
                .filter((u) => u.asJson.bodyCopId === me?.property)
                .map((u) => (
                  <option value={u.asJson.id}>Unit {u.asJson.unitName}</option>
                ))}
            </select>
          )}
        </div>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div>
          {type === "Account" && (
            <IconButton
              onClick={() => updateAccount(params.row.id, params.row.amount)}
            >
              <AssignmentReturnIcon
                style={{
                  color: "#000066",
                }}
              />
            </IconButton>
          )}
          {type === "Supplier" && (
            <IconButton
              onClickCapture={() =>
                onAllocateSupplier(params.row.id, params.row.amount)
              }
            >
              <AssignmentReturnIcon
                style={{
                  color: "#016800",
                }}
              />
            </IconButton>
          )}
          {type === "Customer" && (
            <IconButton
              onClick={() =>
                onAllocate(unitId, params.row.id, params.row.amount)
              }
            >
              <AssignmentReturnIcon
                style={{
                  color: "blue",
                }}
              />
            </IconButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ height: 400 }} className="companies-grid">
        <DataGrid rows={data} columns={column} rowHeight={0} />
      </Box>
      <Modal modalId={DIALOG_NAMES.BODY.ALLOCATE_DIALOGS}>
        <div
          className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog"
          style={{ width: "100%" }}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          {isAllocating && <div data-uk-spinner></div>}
          <h4 className="uk-modal-title">
            UNIT{" "}
            {store.bodyCorperate.unit.all
              .filter((unit) => unit.asJson.id === unitId)
              .map((unit) => {
                return unit.asJson.unitName;
              })}{" "}
          </h4>
          <br />
          <label>Select Account</label>
          <br />
          <select
            className="uk-input"
            onChange={(e) => setAccountId(e.target.value)}
          >
            <option>select accounnt</option>
            {store.bodyCorperate.account.all.map((a) => (
              <option value={a.asJson.id}>{a.asJson.name}</option>
            ))}
          </select>
          <br />

          <table className="uk-table uk-table-divider uk-table-small">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Date Created</th>
                <th>Due Date</th>
                <th>Total Due</th>
                <th>Click Invoice</th>
              </tr>
            </thead>
            <tbody>
              {invoiceCopied
                .filter((inv) => inv.confirmed === false)
                .map((inv) => (
                  <tr key={inv.invoiceId}>
                    <td>{inv.invoiceNumber}</td>
                    <td>{inv.dateIssued}</td>
                    <td>{inv.dueDate}</td>
                    <td>N$ {inv.totalDue.toFixed(2)}</td>
                    <td>
                      <button
                        className="uk-button primary"
                        onClick={() =>
                          updateStatement(
                            inv.invoiceId,
                            inv.invoiceNumber,
                            transactionId,
                            unitId,
                            amount
                          )
                        }
                      >
                        Choose
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.CREATE_INVOICE}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            onClick={clear}
          ></button>
          <h4 className="uk-modal-title">Create Account</h4>
          <form className="uk-grid-small" onSubmit={createAccount} data-uk-grid>
            <div className="uk-width-1-1">
              <label htmlFor="">Name</label>
              <input
                className="uk-input"
                type="text"
                aria-label="100"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div className="uk-width-1-1">
              <label htmlFor="">Description</label>
              <input
                className="uk-input"
                type="text"
                aria-label="100"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
              />
            </div>
            <div className="uk-width-1-1">
              <label htmlFor="">Mobile Number</label>
              <input
                className="uk-input"
                type="number"
                aria-label="100"
                onChange={(e) => setMobile(e.target.value)}
                required
                value={mobile}
              />
            </div>
            <div className="uk-width-1-1">
              <label htmlFor="">Telephone Number</label>
              <input
                className="uk-input"
                type="number"
                aria-label="100"
                onChange={(e) => setTel(e.target.value)}
                required
                value={tel}
              />
            </div>
            <div className="uk-width-1-1">
              <label htmlFor="">Balance</label>
              <input
                className="uk-input"
                type="number"
                aria-label="100"
                onChange={(e) => setBalance(Number(e.target.value))}
                required
                value={balance}
              />
            </div>
            <IconButton type="submit">
              <SaveIcon />
            </IconButton>
            {createLoader && <p>loading...</p>}
          </form>
        </div>
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.BODY_UNIT_DIALOG}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            onClick={clear}
          ></button>
          <h4 className="uk-modal-title">Create Supplier</h4>
          <form
            className="uk-grid-small"
            onSubmit={createSupplier}
            data-uk-grid
          >
            <div className="uk-width-1-1">
              <label htmlFor="">Name</label>
              <input
                className="uk-input"
                type="text"
                aria-label="100"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div className="uk-width-1-1">
              <label htmlFor="">Description</label>
              <input
                className="uk-input"
                type="text"
                aria-label="100"
                onChange={(e) => setDescription(e.target.value)}
                required
                value={description}
              />
            </div>
            <IconButton type="submit">
              <SaveIcon />
            </IconButton>
            {createLoader && <p>loading...</p>}
          </form>
        </div>
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.FINANCIAL_MONTH}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            onClick={clear}
          ></button>
          <h4 className="uk-modal-title">Create Transfer</h4>
          <form
            className="uk-grid-small"
            onSubmit={createTransfer}
            data-uk-grid
          >
            <div className="uk-width-1-1">
              <label htmlFor="">Name</label>
              <input
                className="uk-input"
                type="text"
                aria-label="100"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div className="uk-width-1-1">
              <label htmlFor="">Description</label>
              <input
                className="uk-input"
                type="text"
                aria-label="100"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
              />
            </div>
            <IconButton type="submit">
              <SaveIcon />
            </IconButton>
            {createLoader && <p>loading...</p>}
          </form>
        </div>
      </Modal>
      <Modal modalId={DIALOG_NAMES.BODY.CREATE_ALLOCATE_SUPPLIER}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            onClick={clear}
          ></button>
          {isAllocating && <div data-uk-spinner></div>}
          <div>
            <label>Select Account</label>
            <br />
            <select
              className="uk-input"
              onChange={(e) => setAccountId(e.target.value)}
            >
              <option value="">Select Account</option>
              {store.bodyCorperate.account.all.map((a) => (
                <option value={a.asJson.id}>{a.asJson.name}</option>
              ))}
            </select>
          </div>
          <IconButton onClick={updateSupplier}>
            <SaveIcon />
          </IconButton>
        </div>
      </Modal>
    </>
  );
});

export default FNBDataGrid;

// try {
//   const myPath = `BodyCoperate/${me?.property}`;
//   const accountRef = doc(
//     collection(db, myPath, "BankAccount"),
//     me?.bankAccountInUse
//   );
//   const userSnapshot = await getDoc(accountRef);

//   if (userSnapshot.exists()) {
//     const userData = userSnapshot.data();
//     const currentBalance = userData.totalBalance || 0;
//     const newBalance = currentBalance + amount;

//     await updateDoc(accountRef, {
//       totalBalance: newBalance, // Assuming your balance field is called totalBalance
//     });
//     console.log("Balance updated successfully");
//   } else {
//     console.log("Document not found");
//   }
// } catch (error) {
//   console.error("Error:", error);
// }
