import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import Loading from "../../../../../shared/components/Loading";
import { useAppContext } from "../../../../../shared/functions/Context";
import { IFNB } from "../../../../../shared/models/banks/FNBModel";
import FNBDataGrid from "./FNBDataGrid";
import SingleSelect from "../../../../../shared/components/single-select/SlingleSelect";
import { IconButton } from "@mui/material";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import { nadFormatter } from "../../../../shared/NADFormatter";
import {
  FailedAction,
  SuccessfulAction,
  SuccessfulActionCustomerReceipt,
  SuccessfulActionSupplierPayment,
} from "../../../../../shared/models/Snackbar";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../shared/database/FirebaseConfig";
import { IBankingTransactions } from "../../../../../shared/models/banks/banking/BankTransactions";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import Modal from "../../../../../shared/components/Modal";
import { IReceiptsPayments } from "../../../../../shared/models/receipts-payments/ReceiptsPayments";
import { ICopiedInvoice } from "../../../../../shared/models/invoices/CopyInvoices";
import { INormalAccount } from "../../../../../shared/models/Types/Account";
import { ISupplier } from "../../../../../shared/models/Types/Suppliers";

const TypeCategoriesDat = [
  {
    id: "1",
    name: "Account",
  },
  {
    id: "2",
    name: "Supplier",
  },
  {
    id: "3",
    name: "Customer",
  },
];

export const Allocatate = observer(() => {
  const { store, api, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [statements, setStatements] = useState<IFNB[]>([]);
  const [account, setAccount] = useState<string>("");
  const [supplier, setSupplier] = useState<string>("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [unit, setUnit] = useState<string>("");
  const [isAllocating, setIsAllocating] = useState(false);
  const [type, setType] = useState<string>("");
  const [invoiceCopied, setInvoiceCopied] = useState<ICopiedInvoice[]>([]);
  const me = store.user.meJson;
  const accounts = store.bodyCorperate.account.all;
  const units = store.bodyCorperate.unit.all;
  const suppliers = store.bodyCorperate.supplier.all;

  const types = TypeCategoriesDat.map((t) => {
    return {
      label: t.name,
      value: t.id,
    };
  });

  const _accounts = accounts.map((acc) => {
    return {
      label: acc.asJson.name,
      value: acc.asJson.id,
    };
  });

  const _units = units.map((unit) => {
    return {
      label: `Unit ${unit.asJson.unitName}`,
      value: unit.asJson.id,
    };
  });

  const _supplier = suppliers.map((supp) => {
    return {
      label: supp.asJson.name,
      value: supp.asJson.id,
    };
  });

  const handleType = (selectedValue: string) => {
    setType(selectedValue);
  };

  const handleAccount = (selectedValue: string) => {
    setAccount(selectedValue);
  };
  const handleSupplier = (selectedValue: string) => {
    setSupplier(selectedValue);
  };
  const handleUnit = (selectedValue: string) => {
    setUnit(selectedValue);
  };

  // Generate the rcp number
  const generateInvoiceNumber = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const formattedNumber = randomNumber.toString().padStart(4, "0");
    const generatedInvoiceNumber = `RCP000${formattedNumber}`;
    return generatedInvoiceNumber;
  };

  useEffect(() => {
    const getStatements = async () => {
      await api.body.body.getAll();
      if (me?.property && me.year)
        await api.body.copiedInvoice.getAll(me.property, me.year);
      if (me?.property && me?.year && me?.month) {
        await api.body.fnb.getAll(me.property, me.year, me.month);
        await api.body.account.getAll(me.property);
        await api.unit.getAll(me.property);
        await api.body.supplier.getAll(me.property);
      }
    };
    getStatements();
  }, [
    api.body.body,
    api.body.copiedInvoice,
    api.body.fnb,
    api.body.account,
    me?.property,
    me?.year,
    me?.month,
    api.body.supplier,
    api.unit,
  ]);

  const getTransactionsForYear = async () => {
    setLoading(true);
    const transactions = store.bodyCorperate.fnb.all.map((t) => {
      return t.asJson;
    });
    setStatements(transactions);
    setLoading(false);
  };
  useEffect(() => {
    const getTransactionsForYear = async () => {
      setLoading(true);
      const transactions = store.bodyCorperate.fnb.all.map((t) => {
        return t.asJson;
      });
      setStatements(transactions);
      setLoading(false);
    };
    getTransactionsForYear();
  }, []);

  //accounts

  const updateAccount = async (id: string, amount: number) => {
    if (account === "") {
      FailedAction(ui);
      setAccount("");
      setSupplier("");
      return;
    } else {
      const myPath1 = `BodyCoperate/${me?.property}/FinancialYear/${me?.year}/Months/${me?.month}/`;
      const transactionsCollectionRef = doc(
        collection(db, myPath1, "FNBTransactions"),
        id
      );
      const fnbStatementsSnapshot = await getDoc(transactionsCollectionRef);
      if (fnbStatementsSnapshot.exists()) {
        await updateDoc(transactionsCollectionRef, {
          allocated: true,
          accountId: account,
          rcp: generateInvoiceNumber(),
        });
        // setIsAllocating(false);
        SuccessfulAction(ui);
        setAccount("");
        setSupplier("");
      } else {
        console.log("FnbStatements document not found.");
        FailedAction(ui);
      }

      const trans = store.bodyCorperate.fnb.getById(id);
      const bank_transaction: IBankingTransactions = {
        id: "",
        date: trans?.asJson.date || "",
        payee: account,
        description: trans?.asJson.description || "",
        type: "Account",
        selection: account,
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
        setAccount("");
        setType("");
      } catch (error) {
        console.log(error);
      }

      //general ledge info
      // rerender();
      getTransactionsForYear();
    }
  };

  //suppliers
  const onAllocateSupplier = (id: string, amount: number) => {
    setTransactionId(id);
    setAmount(amount);
    showModalFromId(DIALOG_NAMES.BODY.CREATE_ALLOCATE_SUPPLIER);
  };

  //generate pay number
  const generateInvoiceNumberSupplier = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const formattedNumber = randomNumber.toString().padStart(4, "0");
    const generatedInvoiceNumber = `PAYP000${formattedNumber}`;
    return generatedInvoiceNumber;
  };

  const updateSupplier = async () => {
    setIsAllocating(true);
    try {
      if (supplier === "") {
        FailedAction(ui);
        setAccount("");
        // setTransferId("");
        setSupplier("");
        return;
      } else {
        const myPath1 = `BodyCoperate/${me?.property}/FinancialYear/${me?.year}/Months/${me?.month}/`;
        const transactionsCollectionRef = doc(
          collection(db, myPath1, "FNBTransactions"),
          transactionId
        );
        const fnbStatementsSnapshot = await getDoc(transactionsCollectionRef);
        if (fnbStatementsSnapshot.exists()) {
          await updateDoc(transactionsCollectionRef, {
            allocated: true,
            supplierId: supplier,
            rcp: generateInvoiceNumberSupplier(),
          });
          setIsAllocating(false);
          setAccount("");
          setSupplier("");
          SuccessfulAction(ui);
        } else {
          console.log("FnbStatements document not found.");
          FailedAction(ui);
        }
        // rerender();
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
        payee: supplier,
        description: account,
        type: "Supplier",
        selection: account,
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
        setAccount("");
        setSupplier("");
      } catch (error) {
        console.log(error);
      }
      // gl info implemetation
      try {
        const supplierPath = `BodyCoperate/${me.property}`;
        const supplierRef = doc(
          collection(db, supplierPath, "Suppliers"),
          supplier
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
    getTransactionsForYear();
    hideModalFromId(DIALOG_NAMES.BODY.CREATE_ALLOCATE_SUPPLIER);
  };

  // customer
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

      const transactionsPath = `BodyCoperate/${me?.property}/FinancialYear/${me?.year}/Months/${me?.month}/`;
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
        selection: account,
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
        setAccount("");
      } catch (error) {
        console.log(error);
      }

      setIsAllocating(false);
      setUnit("");
      // rerender();
      hideModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
    }
  };

  //create account

  //create accounts
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mobile, setMobile] = useState("");
  const [tel, setTel] = useState("");
  const [balance, setBalance] = useState(0);

  const onCreateAccount = () => {
    showModalFromId(DIALOG_NAMES.ACCOUNTING_FINANCE_DIALOG.CREATE_ACCOUNT);
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
    hideModalFromId(DIALOG_NAMES.ACCOUNTING_FINANCE_DIALOG.CREATE_ACCOUNT);
  };

  //create supplier
  const onCreateSupplier = () => {
    showModalFromId(DIALOG_NAMES.ACCOUNTING_FINANCE_DIALOG.CREATE_SUPPLIER);
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
    hideModalFromId(DIALOG_NAMES.ACCOUNTING_FINANCE_DIALOG.CREATE_SUPPLIER);
  };

  const clear = () => {
    setName("");
    setDescription("");
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          {/* <FNBDataGrid
            rerender={getTransactionsForYear}
            data={statements.filter((st) => st.allocated === false)}
          /> */}
          <div className="uk-overflow-auto ">
            <table className="uk-table uk-table-small uk-table-striped uk-table-responsive">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service Fee</th>
                  <th>Amount</th>
                  <th>Reference</th>
                  <th>Description</th>
                  <th>Balance</th>
                  <th style={{ width: "12px" }}>Type</th>
                  <th style={{ width: "12px" }}>Selection</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {statements
                  .filter((st) => st.allocated === false)
                  .map((st) => (
                    <tr key={st.id}>
                      <td>{st.date}</td>
                      <td>{nadFormatter.format(parseFloat(st.serviceFee))}</td>
                      <td>{nadFormatter.format(st.amount)}</td>
                      <td>{st.references}</td>
                      <td>{st.description}</td>
                      <td>{nadFormatter.format(st.balance)}</td>
                      <td>
                        <SingleSelect options={types} onChange={handleType} />
                      </td>
                      <td>
                        {type === "1" && (
                          <div style={{ display: "flex" }}>
                            <SingleSelect
                              options={_accounts}
                              onChange={handleAccount}
                            />
                            <IconButton onClick={onCreateAccount}>
                              <AddCircleOutlineIcon />
                            </IconButton>
                          </div>
                        )}
                        {type === "2" && (
                          <div style={{ display: "flex" }}>
                            <SingleSelect
                              options={_supplier}
                              onChange={handleSupplier}
                            />
                            <IconButton onClick={onCreateSupplier}>
                              <AddCircleOutlineIcon />
                            </IconButton>
                          </div>
                        )}
                        {type === "3" && (
                          <SingleSelect
                            options={_units}
                            onChange={handleUnit}
                          />
                        )}
                      </td>

                      <td>
                        {type === "1" && (
                          <IconButton
                            onClick={() => updateAccount(st.id, st.amount)}
                          >
                            <AssignmentReturnIcon
                              style={{
                                color: "#000066",
                              }}
                            />
                          </IconButton>
                        )}
                        {type === "2" && (
                          <IconButton
                            onClickCapture={() =>
                              onAllocateSupplier(st.id, st.amount)
                            }
                          >
                            <AssignmentReturnIcon
                              style={{
                                color: "#016800",
                              }}
                            />
                          </IconButton>
                        )}
                        {type === "3" && (
                          <IconButton
                            onClick={() => onAllocate(unit, st.id, st.amount)}
                          >
                            <AssignmentReturnIcon
                              style={{
                                color: "blue",
                              }}
                            />
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              .filter((un) => un.asJson.id === unit)
              .map((un) => {
                return un.asJson.unitName;
              })}{" "}
          </h4>
          <br />
          <label>Select Account</label>
          <br />
          <SingleSelect options={_accounts} onChange={handleAccount} />
          {/* <select
            className="uk-input"
            onChange={(e) => setAccount(e.target.value)}
          >
            <option>select accounnt</option>
            {store.bodyCorperate.account.all.map((a) => (
              <option value={a.asJson.id}>{a.asJson.name}</option>
            ))}
          </select> */}
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
                            unit,
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
      <Modal modalId={DIALOG_NAMES.BODY.CREATE_ALLOCATE_SUPPLIER}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            // onClick={clear}
          ></button>
          {isAllocating && <div data-uk-spinner></div>}
          <div>
            <label>Select Account</label>
            <br />
            <SingleSelect options={_accounts} onChange={handleAccount} />
          </div>
          <IconButton onClick={updateSupplier}>
            <SaveIcon />
          </IconButton>
        </div>
      </Modal>

      {/* create account dialog */}
      <Modal modalId={DIALOG_NAMES.ACCOUNTING_FINANCE_DIALOG.CREATE_ACCOUNT}>
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

      {/* create supplier dialog */}
      <Modal modalId={DIALOG_NAMES.ACCOUNTING_FINANCE_DIALOG.CREATE_SUPPLIER}>
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
    </div>
  );
});
