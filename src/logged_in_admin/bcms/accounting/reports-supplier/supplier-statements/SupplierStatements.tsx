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
import { ISupplierTransactions } from "../../../../../shared/models/transactions/supplier-transactions/SupplierTransactions";
import { transaction } from "mobx";
import { nadFormatter } from "../../../../shared/NADFormatter";
import SupplierStatementGrid from "./grid/SupplierStatementGrid";

interface Accumulator {
  oldestTransactionDate: string | null;
  total: number;
}

export const SupplierStatements = observer(() => {
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
          leftControls={<></>}
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
      <SupplierStatementGrid data={finalSortedTransactions} />

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
