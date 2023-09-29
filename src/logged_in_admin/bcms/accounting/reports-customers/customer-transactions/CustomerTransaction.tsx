import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import CustomerTransactionsGrid from "./grid/CustomerTransactionsGrid";
import Toolbar2 from "../../../../shared/Toolbar2";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import { IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import Modal from "../../../../../shared/components/Modal";
import { ICustomerTransactions } from "../../../../../shared/models/transactions/customer-transactions/CustomerTransactionModel";
import { nadFormatter } from "../../../../shared/NADFormatter";

interface Accumulator {
  oldestTransactionDate: string | null;
  total: number;
}

export const CustomerTransaction = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const [unitId, setUnitId] = useState<string>("");
  const [customerTranctions, setCustomerTransaction] = useState<
    ICustomerTransactions[]
  >([]);

  // Separate tax invoices and customer receipts
  const taxInvoices = customerTranctions.filter(
    (transaction) => transaction.transactionType === "Tax Invoice"
  );
  const customerReceipts = customerTranctions.filter(
    (transaction) => transaction.transactionType === "Customer Receipt"
  );

  // Sort tax invoices by date
  taxInvoices.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group customer receipts by invoiceId
  const groupedReceipts: Record<string, ICustomerTransactions[]> = {};

  customerReceipts.forEach((receipt) => {
    const invoiceId = receipt.invId;
    if (!groupedReceipts[invoiceId]) {
      groupedReceipts[invoiceId] = [];
    }
    groupedReceipts[invoiceId].push(receipt);
  });

  for (const key in groupedReceipts) {
    if (groupedReceipts.hasOwnProperty(key)) {
      const receipts = groupedReceipts[key];
      const invoice = taxInvoices.find((invoice) => invoice.invId === key);
      if (invoice) {
        receipts.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        let previousBalance = parseFloat(invoice.balance);

        receipts.forEach((receipt) => {
          let creditAmount = parseFloat(receipt.credit);
          receipt.balance = (previousBalance - creditAmount).toFixed(2);
          previousBalance = parseFloat(receipt.balance); // Update previousBalance for next iteration
        });
      }
    }
  }

  const sortedCombinedTransactions: ICustomerTransactions[] = [];
  taxInvoices.forEach((invoice) => {
    sortedCombinedTransactions.push(invoice);
    if (groupedReceipts[invoice.invId]) {
      sortedCombinedTransactions.push(...groupedReceipts[invoice.invId]);
    }
  });

  const finalSortedTransactions = sortedCombinedTransactions.filter(
    (s) => s.unitId === unitId
  );

  const totalBalanceMinusDebit = finalSortedTransactions.reduce(
    (accumulator: Accumulator, transaction) => {
      if (transaction.transactionType === "Tax Invoice") {
        let balance = parseFloat(transaction.balance) || 0;
        let debit = parseFloat(transaction.debit) || 0;

        // Get the transaction date or use a very old date if it's null or undefined
        let transactionDate = transaction.date || "1900-01-01";

        // Check if this Tax Invoice transaction is older than the ones in the accumulator
        if (
          !accumulator.oldestTransactionDate ||
          transactionDate < accumulator.oldestTransactionDate
        ) {
          accumulator.oldestTransactionDate = transactionDate; // Update the oldest transaction date
          accumulator.total = balance - debit; // Update the total with this transaction's balance - debit
        }
      }
      return accumulator;
    },
    { oldestTransactionDate: null, total: 0 } as Accumulator // initial value of the accumulator
  ).total; // return the total from the accumulator
  // return the total from the accumulator

  const oldestTaxInvoiceDate: Date | null = finalSortedTransactions.reduce(
    (oldest: Date | null, transaction: ICustomerTransactions) => {
      if (transaction.transactionType === "Tax Invoice") {
        const transactionDate = new Date(transaction.date);

        if (!isNaN(transactionDate.getTime())) {
          // Check if transactionDate is valid before comparison
          if (oldest === null || transactionDate < oldest) {
            return transactionDate; // Update oldest date if the current transactionDate is older
          }
        }
      }
      return oldest; // Keep the current oldest date
    },
    null
  );

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year) {
        await api.unit.getAll(me.property);
        await api.body.copiedInvoice.getAll(me.property, me.year);
        await api.body.receiptPayments.getAll(me.property, me.year);
        await api.body.customer_transactions.getAll(me.property, me.year);
      }

      const customer_transactions =
        store.bodyCorperate.customerTransactions.all.map((c) => {
          return c.asJson;
        });
      setCustomerTransaction(customer_transactions);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const units = store.bodyCorperate.unit.all.map((u) => {
    return u.asJson;
  });

  const unitBalance = units.find((u) => u.id === unitId)?.balance || 0;

  const searchCustomer = () => {
    showModalFromId(DIALOG_NAMES.BODY.CUSTOMER_TRANSACTIONS_SEARCH);
  };

  return (
    <div>
      <div className="uk-margin">
        <Toolbar2
          leftControls={
            <IconButton style={{ fontSize: "14px" }}>
              {units
                .filter((u) => u.id === unitId)
                .map((u) => {
                  return (
                    "Unit " +
                    u.unitName +
                    ` opening balance at ${oldestTaxInvoiceDate}` +
                    " : " +
                    nadFormatter.format(totalBalanceMinusDebit)
                  );
                })}
            </IconButton>
          }
          rightControls={
            <div>
              <IconButton uk-tooltip="Search unit" onClick={searchCustomer}>
                <ScreenSearchDesktopIcon />
              </IconButton>
              <IconButton uk-tooltip="Print Customer">
                <PrintIcon />
              </IconButton>
              <IconButton uk-tooltip="Export to pdf">
                <PictureAsPdfIcon />
              </IconButton>
              <IconButton uk-tooltip="Export to csv">
                <ArticleIcon />
              </IconButton>
            </div>
          }
        />
      </div>
      <CustomerTransactionsGrid data={finalSortedTransactions} />
      <Toolbar2
        leftControls={
          <IconButton style={{ fontSize: "14px" }}>
            {units
              .filter((u) => u.id === unitId)
              .map((u) => {
                return (
                  "Unit " +
                  u.unitName +
                  ` closing balance` +
                  " : " +
                  nadFormatter.format(unitBalance)
                );
              })}
          </IconButton>
        }
        rightControls={<div></div>}
      />
      <Modal modalId={DIALOG_NAMES.BODY.CUSTOMER_TRANSACTIONS_SEARCH}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            // onClick={clear}
          ></button>
          <div>
            <div>
              <label className="uk-margin">Unit</label>
              <select
                onChange={(e) => setUnitId(e.target.value)}
                className="uk-input"
              >
                <option>Select Customer</option>
                {units
                  .sort((a, b) => a.unitName - b.unitName)
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      Unit {u.unitName}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          {/* <IconButton uk-tooltip="Search" onClick={getData}>
            <TravelExploreIcon />
          </IconButton> */}
        </div>
      </Modal>
    </div>
  );
});

// const combinedTransactions: ICustomerTransactions[] = [];

// invoices.forEach((invoice) => {
//   const transaction: ICustomerTransaction = {
//     id: invoice.invoiceId,
//     unitId: invoice.unitId,
//     date: invoice.dateIssued,
//     reference: invoice.invoiceNumber,
//     transactionType: "Tax Invoice",
//     description: invoice.references,
//     debit: invoice.totalDue.toFixed(2),
//     credit: "",
//     balance: invoice.totalDue.toFixed(2),
//     invId: invoice.invoiceId,
//   };
//   combinedTransactions.push(transaction);
// });

// receipts.forEach((receipt) => {
//   const transaction: ICustomerTransaction = {
//     id: receipt.id,
//     unitId: receipt.unitId,
//     date: receipt.date,
//     reference: receipt.rcp,
//     transactionType: "Customer Receipt",
//     description: receipt.description,
//     debit: "",
//     credit: receipt.debit,
//     balance: "",
//     invId: receipt.invoiceNumber,
//   };
//   combinedTransactions.push(transaction);
// });
