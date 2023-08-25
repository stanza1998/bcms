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
} from "../../../../../shared/models/Snackbar";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { ICopiedInvoice } from "../../../../../shared/models/invoices/CopyInvoices";
import Modal from "../../../../../shared/components/Modal";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { INormalAccount } from "../../../../../shared/models/Types/Account";
import SaveIcon from "@mui/icons-material/Save";

interface IProp {
  data: IFNB[];
  property: string;
}

const FNBDataGrid = observer(({ data, property }: IProp) => {
  const { store, api, ui } = useAppContext();
  const [unitId, setUnit] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<string>("");

  const [invoiceCopied, setInvoiceCopied] = useState<ICopiedInvoice[]>([]);

  useEffect(() => {
    const getStatements = async () => {
      // Otherwise, fetch data and cache it
      await Promise.all([
        api.body.fnb.getUnAllocatedStatements(),
        api.body.body.getAll(),
        api.body.unit.getAll(),
        api.body.copiedInvoice.getAll(),
        api.body.account.getAll(),
        api.body.transfer.getAll(),
        api.body.supplier.getAll(),
      ]);
    };

    getStatements();
  }, []);

  const accounts = store.bodyCorperate.account.all;

  const accountOptions = accounts.map((opt) => ({
    value: opt.asJson.id,
    label: `${opt.asJson.name} ${opt.asJson.description}`,
  }));

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

  // 1. save unitId to transaction, 2. save invoice number to transaction
  // 1. update invoice selected to confirm
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

      const invoiceRef = doc(collection(db, "CopiedInvoices"), id);
      const invoiceSnapshot = await getDoc(invoiceRef);
      if (invoiceSnapshot.exists()) {
        const invoiceData = invoiceSnapshot.data();
        const existingTotalPaid = invoiceData.totalPaid || 0; // Default to 0 if totalPaid doesn't exist

        const updatedTotalPaid = existingTotalPaid + amount;

        await updateDoc(invoiceRef, { totalPaid: updatedTotalPaid });
      } else {
        console.log("Invoice not found.");
        return; // Return early if the invoice doesn't exist
      }

      const fnbStatementsRef = doc(
        collection(db, "FnbStatements"),
        transactionId
      );
      const fnbStatementsSnapshot = await getDoc(fnbStatementsRef);
      if (fnbStatementsSnapshot.exists()) {
        await updateDoc(fnbStatementsRef, {
          allocated: true,
          unitId: unitId,
          invoiceNumber: invoiceNumber,
        });
        setIsAllocating(false);
        SuccessfulAction(ui);
      } else {
        console.log("FnbStatements document not found.");
        FailedAction(ui);
      }
    } catch (error) {
      console.log("🚀 ~error:", error);
      FailedAction(ui);
    } finally {
      setIsAllocating(false);
      setUnit("");
      hideModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
    }
  };

  const [accountId, setAccountId] = useState<string>("");
  console.log("🚀 ~ accountId:", accountId);
  const [transferId, setTransferId] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");

  const updateAccount = async (id: string) => {
    if (accountId === "") {
      FailedAction(ui);
      setAccountId("");
      setTransferId("");
      setSupplierId("");
      return;
    } else {
      const fnbStatementsRef = doc(collection(db, "FnbStatements"), id);
      const fnbStatementsSnapshot = await getDoc(fnbStatementsRef);
      if (fnbStatementsSnapshot.exists()) {
        await updateDoc(fnbStatementsRef, {
          allocated: true,
          accountId: accountId,
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
    }
  };

  const updateSupplier = async (id: string) => {
    if (supplierId === "") {
      FailedAction(ui);
      setAccountId("");
      setTransferId("");
      setSupplierId("");
      return;
    } else {
      const fnbStatementsRef = doc(collection(db, "FnbStatements"), id);
      const fnbStatementsSnapshot = await getDoc(fnbStatementsRef);
      if (fnbStatementsSnapshot.exists()) {
        await updateDoc(fnbStatementsRef, {
          allocated: true,
          accountId: supplierId,
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
    }
  };
  const updateTransfer = async (id: string) => {
    if (transferId === "") {
      FailedAction(ui);
      setAccountId("");
      setTransferId("");
      setSupplierId("");
      return;
    } else {
      const fnbStatementsRef = doc(collection(db, "FnbStatements"), id);
      const fnbStatementsSnapshot = await getDoc(fnbStatementsRef);
      if (fnbStatementsSnapshot.exists()) {
        await updateDoc(fnbStatementsRef, {
          allocated: true,
          accountId: transferId,
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
    }
  };

  //create accounts
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onCreateAccount = () => {
    showModalFromId(DIALOG_NAMES.BODY.CREATE_INVOICE);
  };
  const onCreateSupplier = () => {
    showModalFromId(DIALOG_NAMES.BODY.BODY_UNIT_DIALOG);
  };
  const onCreateTransfer = () => {
    showModalFromId(DIALOG_NAMES.BODY.FINANCIAL_MONTH);
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
    };
    try {
      await api.body.account.create(Account);
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
    const Account: INormalAccount = {
      id: "",
      name: name,
      description: description,
    };
    try {
      await api.body.supplier.create(Account);
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
    const Account: INormalAccount = {
      id: "",
      name: name,
      description: description,
    };
    try {
      await api.body.transfer.create(Account);
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
    { field: "date", headerName: "Date", width: 100 },
    { field: "serviceFee", headerName: "Swervice Fee", width: 100 },
    { field: "amount", headerName: "Amount", width: 100 },
    { field: "references", headerName: "Reference", width: 100 },
    { field: "description", headerName: "Description", width: 100 },
    { field: "balance", headerName: "Balance", width: 100 },
    {
      field: "Type ",
      headerName: "Type",
      width: 100,
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
            <option value="Transfer">Transfer</option>
          </select>
        </div>
      ),
    },
    {
      field: "Selection ",
      headerName: "Selection",
      width: 250,
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
                .filter((u) => u.asJson.bodyCopId === params.row.propertyId)
                .map((u) => (
                  <option value={u.asJson.id}>Unit {u.asJson.unitName}</option>
                ))}
            </select>
          )}
          {type === "Transfer" && (
            <>
              <select
                style={{ width: "82%" }}
                name=""
                id=""
                className="uk-input uk-form-small"
                onChange={(e) => setTransferId(e.target.value)}
              >
                <option value="">Select Account</option>
                {store.bodyCorperate.transfer.all.map((a) => (
                  <option value={a.asJson.id}>
                    {a.asJson.name} , {a.asJson.description}
                  </option>
                ))}
              </select>
              <IconButton onClick={onCreateTransfer}>
                <AddCircleOutlineIcon />
              </IconButton>
            </>
          )}
        </div>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div>
          {type === "Account" && (
            <IconButton onClick={() => updateAccount(params.row.id)}>
              <AssignmentReturnIcon
                style={{
                  color: "#000066",
                }}
              />
            </IconButton>
          )}
          {type === "Supplier" && (
            <IconButton onClick={() => updateSupplier(params.row.id)}>
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
          {type === "Transfer" && (
            <IconButton onClick={() => updateTransfer(params.row.id)}>
              <AssignmentReturnIcon
                style={{
                  color: "#4e006a",
                }}
              />
            </IconButton>
          )}
        </div>
      ),
      //  valueGetter: () => toEdit, // Pass the toEdit function here
    },
  ];

  return (
    <>
      <Box sx={{ height: 400 }} className="companies-grid">
        <DataGrid
          rows={data}
          //   columns={column}
          columns={column}
          //   getRowId={(row) => row.id}
          rowHeight={40}
        />
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
    </>
  );
});

export default FNBDataGrid;
