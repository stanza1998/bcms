import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { useEffect } from "react";
import BankingTransactionGrid from "./grid/BankingTransactionGrid";
import Toolbar2 from "../../../shared/Toolbar2";
import SwapVerticalCircleSharpIcon from "@mui/icons-material/SwapVerticalCircleSharp";
import ArrowCircleUpSharpIcon from "@mui/icons-material/ArrowCircleUpSharp";
import ArrowCircleDownSharpIcon from "@mui/icons-material/ArrowCircleDownSharp";
import { nadFormatter } from "../../../shared/NADFormatter";

export const BankingTransactions = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;

  const transactions = store.bodyCorperate.bankingTransactions.all.map((t) => {
    return t.asJson;
  });

  let totalDebit = 0;
  let totalCredit = 0;

  transactions.forEach((transaction) => {
    console.log(transaction);
    totalDebit += parseFloat(transaction.debit) || 0;
    totalCredit += parseFloat(transaction.credit) || 0;
  });

  const totalBalance = totalDebit - totalCredit;

  const formattedTotalBalance = nadFormatter.format(totalBalance);
  const formattedTotalDebit = nadFormatter.format(totalDebit);
  const formattedTotalCredit = nadFormatter.format(totalCredit);

  const units = store.bodyCorperate.unit.all.map((u) => {
    return u.asJson;
  });
  const accounts = store.bodyCorperate.account.all.map((a) => {
    return a.asJson;
  });
  const suppliers = store.bodyCorperate.supplier.all.map((s) => {
    return s.asJson;
  });

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.bankAccountInUse)
        await api.body.banking_transaction.getAll(
          me.property,
          me.bankAccountInUse
        );
      if (me?.property) await api.unit.getAll(me?.property);
      if (me?.property) await api.body.account.getAll(me?.property);
      if (me?.property) await api.body.supplier.getAll(me?.property);
    };
    getData();
  }, []);

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <Toolbar2 leftControls={<div></div>} rightControls={<div></div>} />
        <Toolbar2
          leftControls={
            <div>
              <span className="uk-margin-right" style={{ fontSize: "18px" }}>
                <ArrowCircleUpSharpIcon style={{ color: "green" }} /> Debits:{" "}
                {formattedTotalDebit}
              </span>
              <span style={{ fontSize: "18px" }} className="uk-margin-right">
                <ArrowCircleDownSharpIcon style={{ color: "red" }} /> Credits:{" "}
                {formattedTotalCredit}
              </span>
            </div>
          }
          rightControls={
            <div>
              <span style={{ fontSize: "18px" }}>
                <SwapVerticalCircleSharpIcon style={{ color: "#01aced" }} />{" "}
                Balance: {formattedTotalBalance}
              </span>
            </div>
          }
        />
        <BankingTransactionGrid
          data={transactions}
          units={units}
          accounts={accounts}
          suppliers={suppliers}
        />
      </div>
    </div>
  );
});
