import { observer } from "mobx-react-lite";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import {
  FailedAction,
  SuccessfulAction,
} from "../../../../shared/models/Snackbar";
import { IFNB, defaultFNB } from "../../../../shared/models/banks/FNBModel";
import { StatementTabs } from "./StatementsTab";
import Loading from "../../../../shared/components/Loading";
import { db } from "../../../../shared/database/FirebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import showModalFromId, {
  hideModalFromId,
} from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import { ICopiedInvoice } from "../../../../shared/models/invoices/CopyInvoices";

type CSVRow = Array<string | undefined>;

interface Transaction {
  Date: string;
  "SERVICE FEE": string;
  Amount: string;
  DESCRIPTION: string;
  REFERENCE: string;
  Balance: string;
  "CHEQUE NUMBER": string;
}
export const FNB = () => {
  const [activeTab, setActiveTab] = useState("Invoicing");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div>
      <div className="uk-margin">
        <div>
          <div className="uk-margin">
            <StatementTabs
              label="Upload Statement"
              isActive={activeTab === "Invoicing"}
              onClick={() => handleTabClick("Invoicing")}
            />
            <StatementTabs
              label="Allocate Transactions"
              isActive={activeTab === "Expense"}
              onClick={() => handleTabClick("Expense")}
            />
          </div>
          <div className="tab-content">
            {activeTab === "Invoicing" && <FNBUploadState />}
            {activeTab === "Expense" && <Allocatate />}
          </div>
        </div>
      </div>
    </div>
  );
};

const FNBUploadState = observer(() => {
  const { store, api } = useAppContext();
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const parsedData: CSVRow[] = result.data as CSVRow[];
          setCSVData(parsedData.slice(2));
          const transactionsData = parsedData.slice(3);
          const transactions: Transaction[] = transactionsData.map((data) => {
            const [
              Date = "",
              SeviceFee = "",
              Amount = "",
              DESCRIPTION = "",
              REFERENCE = "",
              Balance = "",
              ChequeReference = "",
            ] = data;

            return {
              Date,
              "SERVICE FEE": SeviceFee,
              Amount,
              DESCRIPTION,
              REFERENCE,
              Balance,
              "CHEQUE NUMBER": ChequeReference,
            };
          });
          setTransactions(transactions);
        },
        header: false,
      });
    }
  };

  const [loading, setLoading] = useState(false);
  const saveFNBStatement = () => {
    transactions.forEach(async (transaction: Transaction) => {
      const saveUpload: IFNB = {
        id: "",
        propertyId: "",
        unitId: "",
        date: transaction.Date,
        serviceFee: transaction["SERVICE FEE"],
        amount: parseFloat(transaction.Amount),
        description: transaction.DESCRIPTION,
        references: transaction.REFERENCE,
        balance: parseFloat(transaction.Balance),
        chequeNumber: parseFloat(transaction["CHEQUE NUMBER"]),
        allocated: false,
        invoiceNumber: "",
        expenses: false,
      };
      try {
        setLoading(true);
        await api.body.fnb.create(saveUpload);
        setLoading(false);
      } catch (error) {
        FailedAction(error);
      }
    });
  };

  const statement = store.bodyCorperate.fnb.all.filter(
    (st) => st.asJson.allocated === false
  );
  const constraint = statement.length > 0;

  useEffect(() => {
    const getStatements = async () => {
      await api.body.fnb.getAll();
    };
    getStatements();
  }, [api.body.fnb]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="uk-margin">
            <div data-uk-form-custom>
              <input
                type="file"
                aria-label="Custom controls"
                onChange={handleFileUpload}
              />
              <button
                style={{ border: "1px solid lightgrey" }}
                className="uk-button uk-button-default"
                type="button"
              >
                Select
              </button>
            </div>
          </div>
          {transactions.map((trans) => trans).length > 0 && (
            <button
              disabled={constraint}
              style={{ background: constraint ? "grey" : "" }}
              data-uk-tooltip={
                constraint
                  ? "please complete the allocation of statement uploaded"
                  : "save and allocate"
              }
              className="uk-button primary"
              onClick={saveFNBStatement}
            >
              Save Statement
            </button>
          )}

          <div className="uk-margin">
            <table className="uk-table uk-table-divider uk-table-small">
              <thead>
                <tr>
                  {csvData.length > 0 &&
                    csvData[0].map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {csvData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell} </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
});

const Allocatate = observer(() => {
  const { store, api, ui } = useAppContext();
  const [propertyId, setPropertyId] = useState<string>("");
  const [fnb, setFnb] = useState<IFNB | undefined>({ ...defaultFNB });
  const [loading, setLoading] = useState(false);
  const [unitId, setUnit] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState(0);

  const [invoiceCopied, setInvoiceCopied] = useState<ICopiedInvoice[]>([]);

  const getStatements = async () => {
    await api.body.fnb.getAll();
    await api.body.body.getAll();
    await api.body.unit.getAll();
    await api.body.invoice.getAll();
    await api.body.copiedInvoice.getAll();
  };

  useEffect(() => {
    const getStatements = async () => {
      await api.body.fnb.getAll();
      await api.body.body.getAll();
      await api.body.unit.getAll();
      await api.body.invoice.getAll();
      await api.body.copiedInvoice.getAll();
    };
    getStatements();
  }, [
    api.body.body,
    api.body.copiedInvoice,
    api.body.fnb,
    api.body.invoice,
    api.body.unit,
    store.bodyCorperate.invoice,
    unitId,
  ]);

  const statements = store.bodyCorperate.fnb.all.map((statements) => {
    return statements.asJson;
  });
  const statementsForContraints = store.bodyCorperate.fnb.all
    .filter((st) => st.asJson.propertyId)
    .map((statements) => {
      return statements.asJson;
    });

  const updateProperties = async () => {
    setLoading(true);
    const fnbStatementsRef = collection(db, "FnbStatements");

    try {
      const querySnapshot = await getDocs(fnbStatementsRef);

      const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();

        if (!data.allocated) {
          // Update the document only if 'allocated' is false
          const docRef = doc(db, "FnbStatements", docSnapshot.id);
          await updateDoc(docRef, { propertyId: propertyId });
        }
      });

      await Promise.all(updatePromises);

      console.log("Documents updated successfully.");
    } catch (error) {
      console.error("Error updating documents:", error);
    }
    setLoading(false);
  };

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
      getStatements();
      setUnit("");
      hideModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
    }
  };

  //expense
  const updateExpenses = async (amount: number, id: string) => {
    if (amount > 0) {
      FailedAction(ui);
      return;
    }
    setIsAllocating(true);
    const fnbStatementsRef = doc(collection(db, "FnbStatements"), id);
    const invoiceSnapshot = await getDoc(fnbStatementsRef);
    if (invoiceSnapshot.exists()) {
      await updateDoc(fnbStatementsRef, { allocated: true, expenses: true });
    } else {
      console.log("Invoice not found.");
      return; // Return early if the invoice doesn't exist
    }
    getStatements();
    SuccessfulAction(ui);
    setIsAllocating(false);
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <select
            disabled={
              statementsForContraints
                .filter((st) => st.allocated === false)
                .map((st) => st).length > 0
            }
            name=""
            id=""
            className="uk-input uk-form-small"
            onChange={(e) => setPropertyId(e.target.value)}
            style={{ width: "30%" }}
          >
            <option value="">Select Property</option>
            {store.bodyCorperate.bodyCop.all.map((prop) => (
              <option value={prop.asJson.id}>{prop.asJson.BodyCopName}</option>
            ))}
          </select>
          {propertyId !== "" && (
            <button
              className="uk-button primary uk-margin-left"
              onClick={updateProperties}
            >
              Mark statement for{" "}
              {store.bodyCorperate.bodyCop.all
                .filter((prop) => prop.asJson.id === propertyId)
                .map((prop) => {
                  return prop.asJson.BodyCopName;
                })}
            </button>
          )}
          {isAllocating && <div data-uk-spinner></div>}

          <div className="uk-margin">
            <table className="uk-table uk-table-divider uk-table-small">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service Fee</th>
                  <th>Amount</th>
                  <th>Reference</th>
                  <th>Description</th>
                  <th>Balance</th>
                  <th>Cheque Number</th>
                  <th>Property</th>
                  <th>Unit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {statements
                  .filter((st) => st.allocated === false)
                  .map((st) => (
                    <tr key={st.id}>
                      <td>{st.date}</td>
                      <td>{st.serviceFee}</td>
                      <td>
                        <span
                          style={{
                            background: st.amount < 0 ? "red" : "green",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            paddingTop: "1px",
                            paddingBottom: "1px",
                            borderRadius: "11px",
                            color: "white",
                          }}
                        >
                          {st.amount}
                        </span>
                      </td>
                      <td>{st.references}</td>
                      <td style={{ whiteSpace: "pre-line" }}>
                        {st.description}
                      </td>
                      <td>{st.balance}</td>
                      <td>{st.chequeNumber}</td>
                      <td>
                        {store.bodyCorperate.bodyCop.all
                          .filter((prop) => prop.asJson.id === st.propertyId)
                          .map((prop) => {
                            return prop.asJson.BodyCopName;
                          })}
                      </td>
                      <td>
                        <select
                          name=""
                          id=""
                          className="uk-input uk-form-small"
                          onChange={(e) => setUnit(e.target.value)}
                        >
                          <option value="">select unit</option>
                          {store.bodyCorperate.unit.all
                            .filter(
                              (unit) => unit.asJson.bodyCopId === st.propertyId
                            )
                            .sort(
                              (a, b) => a.asJson.unitName - b.asJson.unitName
                            )
                            .map((unit) => (
                              <option value={unit.asJson.id}>
                                unit {unit.asJson.unitName}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td>
                        <button
                          disabled={unitId === ""}
                          style={{
                            backgroundColor: unitId === "" ? "grey" : "",
                          }}
                          className="uk-button primary"
                          onClick={() => onAllocate(unitId, st.id, st.amount)}
                        >
                          <span data-uk-icon="plus-circle"></span>
                        </button>
                        <button
                          className="uk-button primary uk-margin-left"
                          style={{
                            background: st.propertyId === "" ? "grey" : "red",
                          }}
                        >
                          <span
                            style={{ color: "white" }}
                            onClick={() => updateExpenses(st.amount, st.id)}
                            data-uk-icon="minus-circle"
                          ></span>
                        </button>
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
    </div>
  );
});
