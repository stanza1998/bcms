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
  const [propertyId, setPropertyId] = useState<string>("");
  const [financialYear, setFinancialYear] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      await api.body.financialYear.getAll();
    };
    getData();
  }, [api.body.body, api.body.financialYear]);

  const property = store.bodyCorperate.bodyCop.all;
  const year = store.bodyCorperate.financialYear.all;

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

      // Reference to the "BodyCoperate" collection
      const bodyCoperateCollectionRef = collection(db, "BodyCoperate");

      // Reference to the specific document in "BodyCoperate"
      const bodyCoperateDocRef = doc(
        bodyCoperateCollectionRef,
        "Kro9GBJpsTULxDsFSl4d"
      );

      // Reference to the "Year" subcollection under the specific document
      const yearCollectionRef = collection(bodyCoperateDocRef, "Year");

      // Now, let's work with the "Transactions" subcollection under the specific year
      const yearDocRef = doc(yearCollectionRef, "2023");
      const transactionsCollectionRef = collection(yearDocRef, "Transactions");

      // Check if the year already exists in the "Year" subcollection
      const yearDocSnapshot = await getDoc(yearDocRef);
      if (!yearDocSnapshot.exists()) {
        // If the year document doesn't exist, create it
        await setDoc(yearDocRef, {});
      }

      // Process each transaction and save it
      for (const transaction of transactions) {
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
          accountId: "",
          supplierId: "",
          transferId: "",
          rcp: "",
          supplierInvoiceNumber: "",
        };
        // await api.body.fnb.create(saveUpload);
        const transactionDocRef = doc(transactionsCollectionRef);
        saveUpload.id = transactionDocRef.id;
        await setDoc(transactionDocRef, saveUpload);
      }

      setTransactions([]);
      setLoading(false);
    } catch (error) {
      FailedAction(error);
      setLoading(false);
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
          {transactions.map((trans) => trans).length > 0 && (
            <button className="uk-button primary" onClick={saveFNBStatement}>
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
        </>
      )}
    </div>
  );
});

const Allocatate = observer(() => {
  const { store, api, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [statements, setStatements] = useState<IFNB[]>([]);

  useEffect(() => {
    const getStatements = async () => {
      await api.body.body.getAll();
      await api.body.copiedInvoice.getAll();
    };
    getStatements();
  }, []);

  const getTransactionsForYear = async () => {
    setLoading(true);
    try {
      const bodyCoperateCollectionRef = collection(db, "BodyCoperate");

      // Reference to the specific document in "BodyCoperate"
      const bodyCoperateDocRef = doc(
        bodyCoperateCollectionRef,
        "Kro9GBJpsTULxDsFSl4d"
      );
      // Reference to the "Year" subcollection under the specific document
      const yearCollectionRef = collection(bodyCoperateDocRef, "Year");
      // Reference to the specific year document
      const yearDocRef = doc(yearCollectionRef, "2023");
      // Reference to the "Transactions" subcollection under the specific year document
      const transactionsCollectionRef = collection(yearDocRef, "Transactions");
      // Query the transactions
      const transactionsQuerySnapshot = await getDocs(
        transactionsCollectionRef
      );

      const transactions = transactionsQuerySnapshot.docs.map((doc) => {
        return doc.data() as IFNB;
      });
      setStatements(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
    setLoading(false);
  };
  useEffect(() => {
    const getTransactionsForYear = async () => {
      setLoading(true);
      try {
        const bodyCoperateCollectionRef = collection(db, "BodyCoperate");

        // Reference to the specific document in "BodyCoperate"
        const bodyCoperateDocRef = doc(
          bodyCoperateCollectionRef,
          "Kro9GBJpsTULxDsFSl4d"
        );
        // Reference to the "Year" subcollection under the specific document
        const yearCollectionRef = collection(bodyCoperateDocRef, "Year");
        // Reference to the specific year document
        const yearDocRef = doc(yearCollectionRef, "2023");
        // Reference to the "Transactions" subcollection under the specific year document
        const transactionsCollectionRef = collection(
          yearDocRef,
          "Transactions"
        );
        // Query the transactions
        const transactionsQuerySnapshot = await getDocs(
          transactionsCollectionRef
        );

        const transactions = transactionsQuerySnapshot.docs.map((doc) => {
          return doc.data() as IFNB;
        });
        setStatements(transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
      }
      setLoading(false);
    };
    getTransactionsForYear();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <br />
          <br />
          <FNBDataGrid
            data={statements.filter((st) => st.allocated === false)}
           
          />
        </div>
      )}
    </div>
  );
});

// const saveFNBStateme = () => {
//   transactions.forEach(async (transaction: Transaction) => {
//     const saveUpload: IFNB = {
//       id: "",
//       propertyId: "",
//       unitId: "",
//       date: transaction.Date,
//       serviceFee: transaction["SERVICE FEE"],
//       amount: parseFloat(transaction.Amount),
//       description: transaction.DESCRIPTION,
//       references: transaction.REFERENCE,
//       balance: parseFloat(transaction.Balance),
//       chequeNumber: parseFloat(transaction["CHEQUE NUMBER"]),
//       allocated: false,
//       invoiceNumber: "",
//       expenses: false,
//       accountId: "",
//       supplierId: "",
//       transferId: "",
//       rcp: "",
//       supplierInvoiceNumber: "",
//     };
//     try {
//       setLoading(true);
//       const year = 2023; // The year you want to work with
//       // Reference to the "BodyCoperate" collection
//       const bodyCoperateCollectionRef = collection(db, "BodyCoperate");

//       // Reference to the specific document in "BodyCoperate"
//       const bodyCoperateDocRef = doc(
//         bodyCoperateCollectionRef,
//         "dt9Yz58HEQEh63l43AUV"
//       );

//       // Reference to the "Year" subcollection under the specific document
//       const yearCollectionRef = collection(bodyCoperateDocRef, "Year");

//       // Check if the year already exists in the "Year" subcollection
//       const yearQuerySnapshot = await getDocs(yearCollectionRef);
//       const yearExists = yearQuerySnapshot.docs.some(
//         (doc) => doc.data().year === year
//       );

//       if (!yearExists) {
//         // If the year doesn't exist, create a new document with the year
//         await addDoc(yearCollectionRef, { year: year });
//       }

//       // Now, let's work with the "Transactions" subcollection under the specific year
//       const yearDocRef = doc(bodyCoperateDocRef, "Year", year.toString());
//       const transactionsCollectionRef = collection(
//         yearDocRef,
//         "Transactions"
//       );

//       // Assuming you have the data to save as "saveUpload"
//       await addDoc(transactionsCollectionRef, saveUpload);

//       setTransactions([]);
//       setLoading(false);
//     } catch (error) {
//       FailedAction(error);
//       setLoading(false);
//     }
//   });
// };

// const updateProperties = async () => {
//   setLoading(true);
//   const fnbStatementsRef = collection(db, "FnbStatements");

//   try {
//     const querySnapshot = await getDocs(fnbStatementsRef);

//     const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
//       const data = docSnapshot.data();

//       if (!data.allocated) {
//         // Update the document only if 'allocated' is false
//         const docRef = doc(db, "FnbStatements", docSnapshot.id);
//         await updateDoc(docRef, { propertyId: propertyId });
//       }
//     });

//     await Promise.all(updatePromises);

//     console.log("Documents updated successfully.");
//   } catch (error) {
//     console.error("Error updating documents:", error);
//   }
//   setLoading(false);
// };
