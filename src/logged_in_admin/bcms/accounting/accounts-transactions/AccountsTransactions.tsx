import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { nadFormatter } from "../../../shared/NADFormatter";

export const AccountsTransactions = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;

  const account_transactions = store.bodyCorperate.accountsTransactions.all;
  const accounts = store.bodyCorperate.account.all;

  useEffect(() => {
    const getData = async () => {
      if (!me?.property && !me?.year) return;
      await api.body.accountsTransactions.getAll(me?.property, me?.year);
      await api.body.account.getAll(me.property);
    };
    getData();
  }, [api.body.account, api.body.accountsTransactions, me?.property, me?.year]);

  //grouping
  // Create a map to store grouped transactions
  const groupedTransactions = new Map();

  // Iterate through the transactions
  account_transactions.forEach((a) => {
    const description = a.asJson.description;

    if (groupedTransactions.has(description)) {
      groupedTransactions.get(description).push(a);
    } else {
      groupedTransactions.set(description, [a]);
    }
  });

  return (
    <div>
      <div>
        <table className="uk-table uk-table-divider uk-table-small uk-table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Bank/Customer/Supplier</th>
              <th>Reference</th>
              <th>Transaction Type</th>
              <th>Description</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(groupedTransactions).map(
              ([description, transactions]) => {
                // Sort transactions by date
                transactions.sort(
                  (a: any, b: any) =>
                    new Date(a.asJson.date).getTime() -
                    new Date(b.asJson.date).getTime()
                );

                // Initialize total credit and total debit
                let totalCredit = 0;
                let totalDebit = 0;
                let finalBalance = 0;

                return (
                  <React.Fragment key={description}>
                    <tr>
                      <td colSpan={8}>
                        {accounts
                          .filter((acc) => acc.asJson.id === description)
                          .map((acc) => acc.asJson.name)}
                      </td>
                    </tr>
                    {transactions.map((a: any) => {
                      // Update total credit and total debit
                      totalCredit += a.asJson.credit;
                      totalDebit += a.asJson.debit;

                      finalBalance = totalCredit - totalDebit;

                      return (
                        <tr key={a.asJson.id}>
                          <td>{a.asJson.date}</td>
                          <td>{a.asJson.BankCustomerSupplier}</td>
                          <td>{a.asJson.reference}</td>
                          <td>{a.asJson.transactionType}</td>
                          <td>
                            {accounts
                              .filter((acc) => acc.asJson.id === description)
                              .map((acc) => acc.asJson.name)}
                          </td>
                          <td>{nadFormatter.format(a.asJson.debit)}</td>
                          <td>{nadFormatter.format(a.asJson.credit)}</td>
                          <td>{nadFormatter.format(finalBalance)}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={5}></td>
                      <td>{nadFormatter.format(totalDebit)}</td>
                      <td>{nadFormatter.format(totalCredit)}</td>
                      <td>{nadFormatter.format(finalBalance)}</td>
                    </tr>
                  </React.Fragment>
                );
              }
            )}

            {/* {Array.from(groupedTransactions).map(
              ([description, transactions]) => {
                // Sort transactions by date
                transactions.sort(
                  (a: any, b: any) =>
                    new Date(a.asJson.date).getTime() -
                    new Date(b.asJson.date).getTime()
                );

                // Initialize total credit and total debit
                let totalCredit = 0;
                let totalDebit = 0;

                return (
                  <React.Fragment key={description}>
                    <tr>
                      <td colSpan={8}>
                        {accounts
                          .filter((acc) => acc.asJson.id === description)
                          .map((acc) => acc.asJson.name)}
                      </td>
                    </tr>
                    {transactions.map((a: any) => {
                      // Update total credit and total debit
                      totalCredit += a.asJson.credit;
                      totalDebit += a.asJson.debit;

                      return (
                        <tr key={a.asJson.id}>
                          <td>{a.asJson.date}</td>
                          <td>{a.asJson.BankCustomerSupplier}</td>
                          <td>{a.asJson.reference}</td>
                          <td>{a.asJson.transactionType}</td>
                          <td>
                            {accounts
                              .filter((acc) => acc.asJson.id === description)
                              .map((acc) => acc.asJson.name)}
                          </td>
                          <td>{nadFormatter.format(a.asJson.debit)}</td>
                          <td>{nadFormatter.format(a.asJson.credit)}</td>
                          <td>{a.asJson.balance}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={5}></td>
                      <td>{nadFormatter.format(totalDebit)}</td>
                      <td>{nadFormatter.format(totalCredit)}</td>
                      <td>{nadFormatter.format(totalCredit - totalDebit)}</td>
                    </tr>
                  </React.Fragment>
                );
              }
            )} */}

            {/* {Array.from(groupedTransactions).map(
              ([description, transactions]) => {
                // Sort transactions by date
                transactions.sort(
                  (a: any, b: any) =>
                    new Date(a.asJson.date).getTime() -
                    new Date(b.asJson.date).getTime()
                );

                return (
                  <React.Fragment key={description}>
                    <tr>
                      <td colSpan={8}>
                        {accounts
                          .filter((acc) => acc.asJson.id === description)
                          .map((acc) => acc.asJson.name)}
                      </td>
                    </tr>
                    {transactions.map((a: any) => (
                      <tr key={a.asJson.id}>
                        <td>{a.asJson.date}</td>
                        <td>{a.asJson.BankCustomerSupplier}</td>
                        <td>{a.asJson.reference}</td>
                        <td>{a.asJson.transactionType}</td>
                        <td>
                          {accounts
                            .filter((acc) => acc.asJson.id === description)
                            .map((acc) => acc.asJson.name)}
                        </td>
                        <td>{nadFormatter.format(a.asJson.debit)}</td>
                        <td>{nadFormatter.format(a.asJson.credit)}</td>
                        <td>{a.asJson.balance}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              }
            )} */}

            {/* {Array.from(groupedTransactions).map(
              ([description, transactions]) => (
                <React.Fragment key={description}>
                  <tr>
                    <td colSpan={8}>
                      {accounts
                        .filter((acc) => acc.asJson.id === description)
                        .map((acc) => {
                          return acc.asJson.name;
                        })}
                    </td>
                  </tr>
                  {transactions.map((a: any) => (
                    <tr key={a.asJson.id}>
                      <td>{a.asJson.date}</td>
                      <td>{a.asJson.BankCustomerSupplier}</td>
                      <td>{a.asJson.reference}</td>
                      <td>{a.asJson.transactionType}</td>
                      <td>
                        {accounts
                          .filter((acc) => acc.asJson.id === description)
                          .map((acc) => {
                            return acc.asJson.name;
                          })}
                      </td>
                      <td>{nadFormatter.format(a.asJson.debit)}</td>
                      <td>{nadFormatter.format(a.asJson.credit)}</td>
                      <td>{a.asJson.balance}</td>
                    </tr>
                  ))}
                </React.Fragment>
              )
            )} */}
          </tbody>
        </table>
      </div>
    </div>
  );
});
