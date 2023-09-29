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

export interface ISupplierTransaction {
  id: string;
  supplierId: string;
  date: string;
  reference: string;
  transactionType: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
  invId: string;
}

export const SupplierTransaction = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const [supplierId, setSupplierId] = useState<string>("");
  const invoices = store.bodyCorperate.supplierInvoice.all.map((i) => {
    return i.asJson;
  });

  
  const receipts = store.bodyCorperate.receiptsPayments.all
    .filter((r) => r.asJson.transactionType === "Supplier Payment")
    .map((r) => {
      return r.asJson;
    });

  const combinedTransactions: ISupplierTransaction[] = [];

  invoices.forEach((invoice) => {
    const transaction: ISupplierTransaction = {
      id: invoice.invoiceId,
      supplierId: invoice.supplierId,
      date: invoice.dateIssued,
      reference: invoice.invoiceNumber,
      transactionType: "Supplier Invoice",
      description: invoice.references,
      debit: "",
      credit: invoice.totalDue.toFixed(2),
      balance: invoice.totalDue.toFixed(2),
      invId: invoice.invoiceId,
    };
    combinedTransactions.push(transaction);
  });

  receipts.forEach((receipt) => {
    const transaction: ISupplierTransaction = {
      id: receipt.id,
      supplierId: receipt.supplierId,
      date: receipt.date,
      reference: receipt.rcp,
      transactionType: "Supplier Payment",
      description: receipt.description,
      debit: receipt.credit,
      credit: "",
      balance: "",
      invId: receipt.invoiceNumber,
    };
    combinedTransactions.push(transaction);
  });

  // Separate tax invoices and customer receipts
  const taxInvoices = combinedTransactions.filter(
    (transaction) => transaction.transactionType === "Supplier Invoice"
  );
  // console.log("🚀 ~  CustomerTransaction ~ taxInvoices:", taxInvoices);
  const supplierPayment = combinedTransactions.filter(
    (transaction) => transaction.transactionType === "Supplier Payment"
  );

  // Sort tax invoices by date
  taxInvoices.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group customer receipts by invoiceId
  const groupedReceipts: Record<string, ISupplierTransaction[]> = {};

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
      const invoice = taxInvoices.find((invoice) => invoice.id === key);
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
  const sortedCombinedTransactions: ISupplierTransaction[] = [];
  taxInvoices.forEach((invoice) => {
    sortedCombinedTransactions.push(invoice);
    if (groupedReceipts[invoice.id]) {
      sortedCombinedTransactions.push(...groupedReceipts[invoice.id]);
    }
  });

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year) {
        await api.unit.getAll(me.property);
        await api.body.copiedInvoice.getAll(me.property, me.year);
        await api.body.receiptPayments.getAll(me.property, me.year);
      }
    };
    getData();
  }, []);

  const suppliers = store.bodyCorperate.supplier.all.map((u) => {
    return u.asJson;
  });

  const searchCustomer = () => {
    showModalFromId(DIALOG_NAMES.BODY.SUPPLIER_TRANSACTIONS_SEARCH);
  };

  return (
    <div>
      <div className="uk-margin">
        <Toolbar2
          leftControls={
            <IconButton>
              {suppliers
                .filter((u) => u.id === supplierId)
                .map((u) => {
                  return u.name;
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
      <SupplierTransactionsGrid
        data={sortedCombinedTransactions.filter(
          (s) => s.supplierId === supplierId
        )}
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
