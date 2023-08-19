import { useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import Papa from "papaparse";
import { observer } from "mobx-react-lite";
import { StatementTabs } from "./StatementsTab";

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
  const { store, api } = useAppContext();

  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [transactions, setTransactions] = useState<NEDBankTransaction[]>([]);
  console.log("🚀 ~transactions:", transactions);

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

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

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
  );
});

const Allocate = observer(() => {
  return <></>;
});
