import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import Toolbar2 from "../../../../shared/Toolbar2";
import { IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import CustomerStatementGrid from "./grid/CustomerStatementGrid";
import Modal from "../../../../../shared/components/Modal";

export interface ICustomerStatements {
  id: string;
  unitId: string;
  date: string;
  reference: string;
  transactionType: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
  invId: string;
}

export const CustomerStatements = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const [unitId, setUnitId] = useState<string>("");
  const invoices = store.bodyCorperate.copiedInvoices.all.map((i) => {
    return i.asJson;
  });
  const receipts = store.bodyCorperate.receiptsPayments.all
    .filter((r) => r.asJson.transactionType === "Customer Receipt")
    .map((r) => {
      return r.asJson;
    });

  const combinedTransactions: ICustomerStatements[] = [];

  invoices.forEach((invoice) => {
    const transaction: ICustomerStatements = {
      id: invoice.invoiceId,
      unitId: invoice.unitId,
      date: invoice.dateIssued,
      reference: invoice.invoiceNumber,
      transactionType: "Tax Invoice",
      description: invoice.references,
      debit: invoice.totalDue.toFixed(2),
      credit: "",
      balance: invoice.totalDue.toFixed(2),
      invId: invoice.invoiceId,
    };
    combinedTransactions.push(transaction);
  });

  receipts.forEach((receipt) => {
    const transaction: ICustomerStatements = {
      id: receipt.id,
      unitId: receipt.unitId,
      date: receipt.date,
      reference: receipt.rcp,
      transactionType: "Customer Receipt",
      description: receipt.description,
      debit: "",
      credit: receipt.debit,
      balance: "",
      invId: receipt.invoiceNumber,
    };
    combinedTransactions.push(transaction);
  });

  // Separate tax invoices and customer receipts
  const taxInvoices = combinedTransactions.filter(
    (transaction) => transaction.transactionType === "Tax Invoice"
  );
  // console.log("🚀 ~  CustomerTransaction ~ taxInvoices:", taxInvoices);
  const customerReceipts = combinedTransactions.filter(
    (transaction) => transaction.transactionType === "Customer Receipt"
  );

  // Sort tax invoices by date
  taxInvoices.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const groupedReceipts: Record<string, ICustomerStatements[]> = {};

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
      const invoice = taxInvoices.find((invoice) => invoice.id === key);
      if (invoice) {
        receipts.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        let previousBalance = parseFloat(invoice.debit);

        receipts.forEach((receipt) => {
          let creditAmount = parseFloat(receipt.credit);
          receipt.balance = (previousBalance - creditAmount).toFixed(2);
          previousBalance = parseFloat(receipt.balance); // Update previousBalance for next iteration
        });
      }
    }
  }

  const sortedCombinedTransactions: ICustomerStatements[] = [];
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

  const units = store.bodyCorperate.unit.all.map((u) => {
    return u.asJson;
  });

  const searchCustomer = () => {
    showModalFromId(DIALOG_NAMES.BODY.CUSTOMER_STATEMENTS_SEARCH);
  };

  return (
    <div>
      <div className="uk-margin">
        <Toolbar2
          leftControls={
            <IconButton>
              {units
                .filter((u) => u.id === unitId)
                .map((u) => {
                  return "Unit " + u.unitName;
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
      <CustomerStatementGrid
        data={sortedCombinedTransactions.filter((s) => s.unitId === unitId)}
      />
      <Modal modalId={DIALOG_NAMES.BODY.CUSTOMER_STATEMENTS_SEARCH}>
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
