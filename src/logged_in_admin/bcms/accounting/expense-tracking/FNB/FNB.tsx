import { observer } from "mobx-react-lite";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import { FailedAction } from "../../../../../shared/models/Snackbar";
import { IFNB } from "../../../../../shared/models/banks/FNBModel";
import { StatementTabs } from "../Tabs/StatementsTab";
import Loading from "../../../../../shared/components/Loading";
import { db } from "../../../../../shared/database/FirebaseConfig";
import {
  WriteBatch,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import FNBDataGrid from "./FNBDataGrid";

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
  const me = store.user.meJson;

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      if (me?.property) await api.body.financialYear.getAll(me.property);
    };
    getData();
  }, [api.body.body, api.body.financialYear, me?.property]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const parsedData: CSVRow[] = result.data as CSVRow[];
          setCSVData(parsedData);
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

  const saveFNBStatement = async () => {
    try {
      setLoading(true);

      if (!me?.property) {
        throw new Error("No property Id");
      }

      const promises = transactions.map(async (transaction) => {
        const saveUpload: IFNB = {
          id: "",
          propertyId: me.property || "",
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
          accountId: "",
          supplierId: "",
          transferId: "",
          rcp: "",
          supplierInvoiceNumber: "",
        };

        await api.body.fnb.create(saveUpload, me.property, me.year, me.month);
      });

      await Promise.all(promises);

      setLoading(false);
    } catch (error) {
      console.error("Error in saveFNBStatement:", error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

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

          <button className="uk-button primary" onClick={saveFNBStatement}>
            Save Statement
          </button>

          <div className="uk-margin">
            <table className="">
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
  const [loading, setLoading] = useState(false);
  const [statements, setStatements] = useState<IFNB[]>([]);
  const me = store.user.meJson;

  useEffect(() => {
    const getStatements = async () => {
      await api.body.body.getAll();
      if (me?.property && me.year)
        await api.body.copiedInvoice.getAll(me.property, me.year);
      if (me?.property && !me?.year && !me?.month)
        await api.body.fnb.getAll(me.property, me.year, me.month);
    };
    getStatements();
  }, [
    api.body.body,
    api.body.copiedInvoice,
    api.body.fnb,
    me?.year,
    me?.property,
    me?.month,
  ]);

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

  const getTransactionsForYear = async () => {
    setLoading(true);
    const transactions = store.bodyCorperate.fnb.all.map((t) => {
      return t.asJson;
    });
    setStatements(transactions);
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <br />
          <br />
          <FNBDataGrid
            rerender={getTransactionsForYear}
            data={statements.filter((st) => st.allocated === false)}
          />
        </div>
      )}
    </div>
  );
});
