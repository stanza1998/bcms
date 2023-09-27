import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import { nadFormatter } from "../../../../shared/NADFormatter";

interface ICustomerTransaction {
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

export const CustomerTransaction = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const invoices = store.bodyCorperate.copiedInvoices.all.map((i) => {
    return i.asJson;
  });
  const receipts = store.bodyCorperate.receiptsPayments.all
    .filter((r) => r.asJson.transactionType === "Customer Receipt")
    .map((r) => {
      return r.asJson;
    });

  const combinedTransactions: ICustomerTransaction[] = [];
  // console.log("🚀 ~]combinedTransactions:", combinedTransactions);

  invoices.forEach((invoice) => {
    const transaction: ICustomerTransaction = {
      id: invoice.invoiceId,
      unitId: invoice.unitId,
      date: invoice.dateIssued,
      reference: invoice.invoiceNumber,
      transactionType: "Tax Invoice",
      description: invoice.references,
      debit: nadFormatter.format(invoice.totalDue),
      credit: "",
      balance: "",
      invId: invoice.invoiceId,
    };
    combinedTransactions.push(transaction);
  });

  receipts.forEach((receipt) => {
    const transaction: ICustomerTransaction = {
      id: receipt.id,
      unitId: receipt.unitId,
      date: receipt.date,
      reference: receipt.rcp,
      transactionType: "Customer Receipt",
      description: receipt.description,
      debit: "",
      credit: nadFormatter.format(parseFloat(receipt.debit)),
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
  // console.log("🚀 ~  CustomerTransaction ~ receipts:", customerReceipts);

  // Sort tax invoices by date
  taxInvoices.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group customer receipts by invoiceId
  const groupedReceipts: Record<string, ICustomerTransaction[]> = {};
  customerReceipts.forEach((receipt) => {
    const invoiceId = receipt.invId; // Assuming reference holds the invoiceId
    if (!groupedReceipts[invoiceId]) {
      groupedReceipts[invoiceId] = [];
    }
    groupedReceipts[invoiceId].push(receipt);
  });

  // Sort customer receipts under each invoice by date
  for (const key in groupedReceipts) {
    if (groupedReceipts.hasOwnProperty(key)) {
      groupedReceipts[key].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }
  }

  // Combine tax invoices and sorted customer receipts
  const sortedCombinedTransactions: ICustomerTransaction[] = [];
  taxInvoices.forEach((invoice) => {
    sortedCombinedTransactions.push(invoice);
    if (groupedReceipts[invoice.id]) {
      sortedCombinedTransactions.push(...groupedReceipts[invoice.id]);
    }
  });

  console.log(sortedCombinedTransactions);

  // sortedCombinedTransactions now contains tax invoices followed by their associated customer receipts, sorted by date

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year) {
        await api.body.copiedInvoice.getAll(me.property, me.year);
        await api.body.receiptPayments.getAll(me.property, me.year);
      }
    };
    getData();
  }, []);

  return (
    <>
      <table className="uk-table uk-table-small uk-table-divider">
        <thead>
          <tr>
            <th>Date</th>
            <th>Reference</th>
            <th>Transaction Type</th>
            <th>Description</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {sortedCombinedTransactions
            // .filter((s) => s.unitId === "kZ6PH1yEQucZqZD8ClFC")
            .map((c, index) => (
              <tr key={index}>
                <td>{c.date}</td>
                <td>{c.reference}</td>
                <td>{c.transactionType}</td>
                <td>{c.description}</td>
                <td>{c.debit}</td>
                <td>{c.credit}</td>
                <td>{c.balance}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
});
