import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import Loading from "../../../../../shared/components/Loading";
import { useAppContext } from "../../../../../shared/functions/Context";
import { IFNB } from "../../../../../shared/models/banks/FNBModel";
import FNBDataGrid from "./FNBDataGrid";

export const Allocatate = observer(() => {
  const { store, api } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [statements, setStatements] = useState<IFNB[]>([]);
  const me = store.user.meJson;

  useEffect(() => {
    const getStatements = async () => {
      await api.body.body.getAll();
      if (me?.property && me.year)
        await api.body.copiedInvoice.getAll(me.property, me.year);
      if (me?.property && !me?.year && !me?.month)
        await api.body.fnb.getAll(me.property, me.year, me.month);
    };
    getStatements();
  }, [
    api.body.body,
    api.body.copiedInvoice,
    api.body.fnb,
    me?.year,
    me?.property,
    me?.month,
  ]);

  useEffect(() => {
    const getTransactionsForYear = async () => {
      setLoading(true);
      const transactions = store.bodyCorperate.fnb.all.map((t) => {
        return t.asJson;
      });
      setStatements(transactions);
      setLoading(false);
    };
    getTransactionsForYear();
  }, []);

  const getTransactionsForYear = async () => {
    setLoading(true);
    const transactions = store.bodyCorperate.fnb.all.map((t) => {
      return t.asJson;
    });
    setStatements(transactions);
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <br />
          <br />
          <FNBDataGrid
            rerender={getTransactionsForYear}
            data={statements.filter((st) => st.allocated === false)}
          />
        </div>
      )}
    </div>
  );
});
