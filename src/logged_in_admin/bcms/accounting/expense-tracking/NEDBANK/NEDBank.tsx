import { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import Papa from "papaparse";
import { observer } from "mobx-react-lite";
import { StatementTabs } from "../Tabs/StatementsTab";
import { INEDBANK } from "../../../../../shared/models/banks/NEDBANK";
import {
  FailedAction,
  SuccessfulAction,
} from "../../../../../shared/models/Snackbar";
import Loading from "../../../../../shared/components/Loading";

type CSVRow = Array<string | undefined>;

interface NEDBankTransaction {
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
  const [transactions, setTransactions] = useState<NEDBankTransaction[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const parsedData: CSVRow[] = result.data as CSVRow[];
          setCSVData(parsedData.slice(16));

          //find
          const closingBalanceIndex = parsedData.findIndex((row) =>
            row.includes("* = inclusive of 15% VAT")
          );

          const transactionsData = parsedData.slice(17, closingBalanceIndex);
          const closingBalance = parsedData.slice(closingBalanceIndex)[0];

          const transactions: NEDBankTransaction[] = transactionsData.map(
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
    transactions.forEach(async function (transaction: NEDBankTransaction) {
      const saveUpload: INEDBANK = {
        id: "",
        propertyId: "",
        unitId: "",
        transactionDate: transaction["Transaction Date"],
        valueDate: transaction["Value Date"],
        transactionReference: transaction["Transaction Reference No."],
        vatIndicator: transaction["*VAT Charge Indicator"],
        debit: parseFloat(transaction.Debit),
        credit: parseFloat(transaction.Credit),
        balance: parseFloat(transaction.Balance),
        allocated: false,
        invoiceNumber: "",
        expenses: false,
        description: transaction.Description,
      };
      try {
        await api.body.nedbank.create(saveUpload);
        SuccessfulAction(ui);
      } catch (error) {
        FailedAction(ui);
      }
    });
    setLoading(false);
  };

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
              // disabled={constraint}
              // style={{ background: constraint ? "grey" : "" }}
              // data-uk-tooltip={
              //   constraint
              //     ? "please complete the allocation of statement uploaded"
              //     : "save and allocate"
              // }
              className="uk-button primary"
              onClick={saveStatement}
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
        </div>
      )}
    </div>
  );
});

const Allocate = observer(() => {
  const { store, api } = useAppContext();

  useEffect(() => {
    const getDate = async () => {
      await api.body.nedbank.getAll();
    };
    getDate();
  }, [api.body.nedbank]);

  return (
    <div>
      <div>
        <table className="uk-table uk-table-divider uk-table-small">
          <thead>
            <tr>
              <th>Transaction Date</th>
              <th>Value Date</th>
              <th>Transaction Reference No.</th>
              <th>Description</th>
              <th>*VAT Charge Indicator</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {store.bodyCorperate.nedbank.all.map((s) => (
              <tr key={s.asJson.id}>
                <td>{s.asJson.transactionDate}</td>
                <td>{s.asJson.valueDate}</td>
                <td>{s.asJson.transactionDate}</td>
                <td>{s.asJson.description}</td>
                <td>{s.asJson.vatIndicator}</td>
                <td>{s.asJson.credit}</td>
                <td>{s.asJson.debit}</td>
                <td>{s.asJson.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
