import { observer } from "mobx-react-lite";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { FailedAction } from "../../../../shared/models/Snackbar";
import { IFNB } from "../../../../shared/models/banks/FNBModel";
import { StatementTabs } from "./StatementsTab";
import Loading from "../../../../shared/components/Loading";

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
  const { api } = useAppContext();
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const parsedData: CSVRow[] = result.data as CSVRow[];
          setCSVData(parsedData.slice(2));
          const transactionsData = parsedData.slice(2);
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

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
          <button onClick={saveFNBStatement}>Save Statement</button>
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

  useEffect(() => {
    const getStatements = async () => {
      await api.body.fnb.getAll();
      await api.body.body.getAll();
      await api.body.unit.getAll();
    };
    getStatements();
  }, [api.body.body, api.body.fnb, api.body.unit]);

  const statements = store.bodyCorperate.fnb.all.map((statements) => {
    return statements.asJson;
  });

  return (
    <div>
      <select
        name=""
        id=""
        className="uk-input"
        onChange={(e) => setPropertyId(e.target.value)}
        style={{ width: "30%" }}
      >
        <option value="">Select Property</option>
        {store.bodyCorperate.bodyCop.all.map((prop) => (
          <option value={prop.asJson.id}>{prop.asJson.BodyCopName}</option>
        ))}
      </select>
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
                <td>{st.description}</td>
                <td>{st.balance}</td>
                <td>{st.chequeNumber}</td>
                <td>
                  <select name="" id="" className="uk-input uk-form-small">
                    <option value="">select unit</option>
                    {store.bodyCorperate.unit.all
                      .filter((unit) => unit.asJson.bodyCopId === propertyId)
                      .map((unit) => (
                        <option value={unit.asJson.id}>
                          {unit.asJson.unitName}
                        </option>
                      ))}
                  </select>
                </td>
                <td>
                  <button className="uk-button primary">Allocate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
