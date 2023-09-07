import { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import Papa from "papaparse";
import { observer } from "mobx-react-lite";
import { INEDBANK } from "../../../../../shared/models/banks/NEDBANK";
import {
  FailedAction,
  SuccessfulAction,
} from "../../../../../shared/models/Snackbar";
import Loading from "../../../../../shared/components/Loading";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../../../shared/database/FirebaseConfig";
import { NEDBANKGrid } from "./NEDBANKGrid";
import { Tab } from "../../../../../Tab";

type CSVRow = Array<string | undefined>;

interface Transaction {
  "Transaction Date": string;
  "Value Date": string;
  "Transaction Reference No.": string;
  Description: string;
  "*VAT Charge Indicator": string;
  Debit: string;
  Credit: string;
  Balance: string;
}

export const NEDBANK = () => {
  const [activeTab, setActiveTab] = useState("Invoicing");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      <div className="uk-margin">
        <div>
          <div
            style={{ padding: "10px" }}
            className="uk-margin  uk-card-default"
          >
            <Tab
              label="Upload Statement"
              isActive={activeTab === "Invoicing"}
              onClick={() => handleTabClick("Invoicing")}
            />
            <Tab
              label="Allocate Transactions"
              isActive={activeTab === "Expense"}
              onClick={() => handleTabClick("Expense")}
            />
          </div>
          <div className="tab-content">
            {activeTab === "Invoicing" && <UploadStatement />}
            {activeTab === "Expense" && <Allocate />}
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadStatement = observer(() => {
  const { store, api, ui } = useAppContext();

  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  console.log("🚀 transactions:", transactions);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const parsedData: CSVRow[] = result.data as CSVRow[];
          setCSVData(parsedData);

          //find
          const closingBalanceIndex = parsedData.findIndex((row) =>
            row.includes("* = inclusive of 15% VAT")
          );

          const transactionsData = parsedData.slice(17, closingBalanceIndex);

          // Filter out rows with undefined values or all empty cells
          const filteredTransactionsData = transactionsData.filter((row) =>
            row.some((cell) => cell !== undefined && cell.trim() !== "")
          );

          const closingBalance = parsedData[closingBalanceIndex][0];

          const transactions: Transaction[] = filteredTransactionsData.map(
            (data) => {
              const [
                TransactionDate = "",
                ValueDate = "",
                TransactionReferenceNo = "",
                Description = "",
                VatIndicator = "",
                Debit = "",
                Credit = "",
                Balance = "",
              ] = data;

              return {
                "Transaction Date": TransactionDate,
                "Value Date": ValueDate,
                "Transaction Reference No.": TransactionReferenceNo,
                Description,
                "*VAT Charge Indicator": VatIndicator,
                Debit,
                Credit,
                Balance,
              };
            }
          );
          setTransactions(transactions);
        },
        header: false,
      });
    }
  };

  const [loading, setLoading] = useState(false);

  const saveStatement = () => {
    setLoading(true);
    transactions.forEach(async function (transaction: Transaction) {
      const formattedCredit = transaction.Credit || "0";
      const sanitizedCredit = formattedCredit.replace(/,/g, "");
      const convertedCredit = parseFloat(sanitizedCredit);
      const formattedDebit = transaction.Debit || "0";
      const sanitizedDebit = formattedDebit.replace(/,/g, "");
      const convertedDebit = parseFloat(sanitizedDebit);
      const formattedBalance = transaction.Balance || "0";
      const sanitizedBalance = formattedBalance.replace(/,/g, "");
      const convertedBalance = parseFloat(sanitizedBalance);

      const saveUpload: INEDBANK = {
        id: "",
        propertyId: "",
        unitId: "",
        transactionDate: transaction["Transaction Date"],
        valueDate: transaction["Value Date"],
        transactionReference: transaction["Transaction Reference No."],
        vatIndicator: transaction["*VAT Charge Indicator"],
        debit: convertedDebit,
        credit: convertedCredit,
        balance: convertedBalance,
        allocated: false,
        invoiceNumber: "",
        expenses: false,
        description: transaction.Description,
        accountId: "",
        supplierId: "",
        transferId: "",
        rcp: "",
        supplierInvoiceNumber: "",
      };
      console.log(parseFloat(transaction.Debit));

      try {
        await api.body.nedbank.create(saveUpload);
        setTransactions([]);
        SuccessfulAction(ui);
        setLoading(false);
      } catch (error) {
        FailedAction(ui);
        setLoading(false);
      }
    });
  };

  const statement = store.bodyCorperate.nedbank.all.filter(
    (st) => st.asJson.allocated === false
  );
  const constraint = statement.length > 0;

  useEffect(() => {
    const getStatements = async () => {
      await api.body.nedbank.getAll();
    };
    getStatements();
  }, [api.body.nedbank]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
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
              onClick={saveStatement}
            >
              Save Statement
            </button>
          )}

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
        </div>
      )}
    </div>
  );
});

const Allocate = observer(() => {
  const { store, api } = useAppContext();
  const [propertyId, setPropertyId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;

  useEffect(() => {
    const getStatements = async () => {
      await api.body.nedbank.getAll();
      await api.body.body.getAll();
      if (me?.property && me.year)
        await api.body.copiedInvoice.getAll(me.property, me.year);
    };
    getStatements();
  }, []);

  const statements = store.bodyCorperate.nedbank.all.map((statements) => {
    return statements.asJson;
  });

  const statementsForContraints = store.bodyCorperate.nedbank.all
    .filter((st) => st.asJson.propertyId)
    .map((statements) => {
      return statements.asJson;
    });

  const updateProperties = async () => {
    setLoading(true);
    const statementsRef = collection(db, "NedBankStatements");

    try {
      const querySnapshot = await getDocs(statementsRef);

      const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();

        if (!data.allocated) {
          // Update the document only if 'allocated' is false
          const docRef = doc(db, "NedBankStatements", docSnapshot.id);
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
          <br />
          <br />
          <NEDBANKGrid
            data={statements.filter((st) => st.allocated === false)}
          />
        </div>
      )}
    </div>
  );
});
