import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import Toolbar2 from "../../../../shared/Toolbar2";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import { IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import Modal from "../../../../../shared/components/Modal";
import SupplierTransactionsGrid from "./grid/SupplierTransactionGrid";
import { ISupplierTransactions } from "../../../../../shared/models/transactions/supplier-transactions/SupplierTransactions";
import { transaction } from "mobx";
import { nadFormatter } from "../../../../shared/NADFormatter";

interface Accumulator {
  oldestTransactionDate: string | null;
  total: number;
}

export const SupplierTransaction = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const [supplierId, setSupplierId] = useState<string>("");
  const [supplierTransactions, setSupplierTransactions] = useState<
    ISupplierTransactions[]
  >([]);

  console.log(supplierTransactions);

  // Separate tax invoices and customer receipts
  const taxInvoices = supplierTransactions.filter(
    (transaction) => transaction.transactionType === "Supplier Invoice"
  );
  // console.log("🚀 ~  CustomerTransaction ~ taxInvoices:", taxInvoices);
  const supplierPayment = supplierTransactions.filter(
    (transaction) => transaction.transactionType === "Supplier Payment"
    // Supplier Payment
  );

  // Sort tax invoices by date
  taxInvoices.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group customer receipts by invoiceId
  const groupedReceipts: Record<string, ISupplierTransactions[]> = {};

  supplierPayment.forEach((receipt) => {
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
        let previousBalance = parseFloat(invoice.credit);

        receipts.forEach((receipt) => {
          let creditAmount = parseFloat(receipt.debit);
          receipt.balance = (previousBalance - creditAmount).toFixed(2);
          previousBalance = parseFloat(receipt.balance); // Update previousBalance for next iteration
        });
      }
    }
  }

  // Combine tax invoices and sorted customer receipts
  const sortedCombinedTransactions: ISupplierTransactions[] = [];
  taxInvoices.forEach((invoice) => {
    sortedCombinedTransactions.push(invoice);
    if (groupedReceipts[invoice.invId]) {
      sortedCombinedTransactions.push(...groupedReceipts[invoice.invId]);
    }
  });

  const finalSortedTransactions = sortedCombinedTransactions.filter(
    (s) => s.supplierId === supplierId
  );

  //used for openning balance
  const totalBalanceMinusDebit = finalSortedTransactions.reduce(
    (accumulator: Accumulator, transaction) => {
      if (transaction.transactionType === "Supplier Invoice") {
        let balance = parseFloat(transaction.balance) || 0;
        let debit = parseFloat(transaction.credit) || 0;

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
    (oldest: Date | null, transaction: ISupplierTransactions) => {
      if (transaction.transactionType === "Supplier Invoice") {
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
        await api.body.supplierInvoice.getAll(me.property, me.year);
        await api.body.receiptPayments.getAll(me.property, me.year);
        await api.body.supplier_transactions.getAll(me.property, me.year);
      }
      const supplier_transactions =
        store.bodyCorperate.supplierTransactions.all.map((c) => {
          return c.asJson;
        });
      setSupplierTransactions(supplier_transactions);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suppliers = store.bodyCorperate.supplier.all.map((u) => {
    return u.asJson;
  });

  const supplierBalance =
    suppliers.find((s) => s.id === supplierId)?.balance || 0;

  const searchCustomer = () => {
    showModalFromId(DIALOG_NAMES.BODY.SUPPLIER_TRANSACTIONS_SEARCH);
  };

  return (
    <div>
      <div className="uk-margin">
        <Toolbar2
          leftControls={
            <IconButton style={{ fontSize: "14px" }}>
              {suppliers
                .filter((u) => u.id === supplierId)
                .map((u) => {
                  return (
                    u.name +
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
      <SupplierTransactionsGrid data={finalSortedTransactions} />
      <Toolbar2
        leftControls={
          <IconButton style={{ fontSize: "14px" }}>
            {suppliers
              .filter((u) => u.id === supplierId)
              .map((u) => {
                return (
                  u.name +
                  ` closing balance` +
                  " : " +
                  nadFormatter.format(supplierBalance)
                );
              })}
          </IconButton>
        }
        rightControls={<div></div>}
      />
      <Modal modalId={DIALOG_NAMES.BODY.SUPPLIER_TRANSACTIONS_SEARCH}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            // onClick={clear}
          ></button>
          <div>
            <div>
              <label className="uk-margin">Supplier</label>
              <select
                onChange={(e) => setSupplierId(e.target.value)}
                className="uk-input"
              >
                <option>Select Supplier</option>
                {suppliers
                  // .sort((a, b) => a.unitName - b.unitName)
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
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
