import { observer } from "mobx-react-lite";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { FailedAction } from "../../../../shared/models/Snackbar";
import { IFNB, defaultFNB } from "../../../../shared/models/banks/FNBModel";
import { StatementTabs } from "./StatementsTab";
import Loading from "../../../../shared/components/Loading";
import { db } from "../../../../shared/database/FirebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import {
  IInvoice,
  defaultInvoice,
} from "../../../../shared/models/invoices/Invoices";
import {
  ICopiedInvoice,
  defaultCopiedInvoice,
} from "../../../../shared/models/invoices/CopyInvoices";

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
  const [invoice, setInvoice] = useState<IInvoice[]>([]);
  const [invoiceCopied, setInvoiceCopied] = useState<ICopiedInvoice[]>([]);

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

  const onAllocate = (unitId: string) => {
    const invoicesCopied = store.bodyCorperate.copiedInvoices.all
      .filter((inv) => inv.asJson.unitId === unitId)
      .map((inv) => {
        return inv.asJson;
      });
    setInvoiceCopied(invoicesCopied);

    showModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <select
            disabled={statementsForContraints.length > 0}
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
          {propertyId !== "" && statementsForContraints.length === 0 && (
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

          <div className="uk-margin">
            <table className="uk-table uk-table-divider uk-table-small">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service Fee</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Balance</th>
                  <th>Cheque Number</th>
                  <th>Property</th>
                  <th>Unit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {statements.map((st) => (
                  <tr key={st.id}>
                    <td>{st.date}</td>
                    <td>{st.serviceFee}</td>
                    <td>{st.amount}</td>
                    <td style={{ whiteSpace: "pre-line" }}>{st.description}</td>
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
                          .sort((a, b) => a.asJson.unitName - b.asJson.unitName)
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
                        onClick={() => onAllocate(unitId)}
                      >
                        Allocate
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
          <h4 className="uk-modal-title">
            UNIT{" "}
            {store.bodyCorperate.unit.all
              .filter((unit) => unit.asJson.id === unitId)
              .map((unit) => {
                return unit.asJson.unitName;
              })}{" "}
          </h4>
          <button className="uk-button primary">Save Allocation</button>
          <table className="uk-table uk-table-divider uk-table-small">
            <thead>
              <tr>
                <th>Select</th>
                <th>Invoice Number</th>
                <th>Date Created</th>
                <th>Due Date</th>
                <th>Total Due</th>
              </tr>
            </thead>
            <tbody>
              {invoiceCopied.map((inv) => (
                <tr key={inv.invoiceId}>
                  <td>
                    <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                      <label>
                        <input className="uk-checkbox" type="checkbox" />
                      </label>
                    </div>
                  </td>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.dateIssued}</td>
                  <td>{inv.dueDate}</td>
                  <td>N$ {inv.totalDue.toFixed(2)}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
});
