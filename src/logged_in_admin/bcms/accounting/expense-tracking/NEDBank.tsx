import { useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import Papa from "papaparse";

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
  const { store, api } = useAppContext();

  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [transactions, setTransactions] = useState<NEDBankTransaction[]>([]);

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

          const transactionsData = parsedData.slice(2, closingBalanceIndex);
          // const transactionsData = parsedData.slice(2);
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

      <table className="uk-table uk-table-small uk-table-divider">
        <thead>
          <tr>
            {csvData.length > 0 &&
              csvData[0].map((header, index) => (
                <tr key={index}>
                  <th>{header}</th>
                </tr>
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
  );
};
