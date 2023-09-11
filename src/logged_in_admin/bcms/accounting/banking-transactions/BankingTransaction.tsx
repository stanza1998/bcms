import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { useEffect } from "react";
import BankingTransactionGrid from "./grid/BankingTransactionGrid";
import Toolbar2 from "../../../shared/Toolbar2";

export const BankingTransactions = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;

  const transactions = store.bodyCorperate.bankingTransactions.all.map((t) => {
    return t.asJson;
  });
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
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Banking</h4>
          <div className="controls">
            <div className="uk-inline"></div>
          </div>
        </div>
        <Toolbar2 leftControls={<div></div>} rightControls={<div></div>} />
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
