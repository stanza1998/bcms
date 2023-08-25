import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useEffect, useState } from "react";

export const FNBStatements = observer(() => {
  const { store, api } = useAppContext();
  const [propertyId, setPropertyId] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      await api.body.account.getAll();
      await api.body.transfer.getAll();
      await api.body.unit.getAll();
      await api.body.supplier.getAll();
    };
    getData();
  }, []);

  return (
    <div>
      <form className="uk-grid-small" data-uk-grid>
        <div className="uk-width-1-1">
          <label htmlFor="">Select Property</label>
          <select className="uk-input" placeholder="100" aria-label="100">
            <option value="">Select Property</option>
            {store.bodyCorperate.bodyCop.all.map((p) => (
              <option value={p.asJson.id}>{p.asJson.BodyCopName}</option>
            ))}
          </select>
        </div>
        <div className="uk-width-1-2@s">
          <label htmlFor="">Select Type</label>
          <select className="uk-input" placeholder="50" aria-label="50">
            <option value="">All</option>
            <option value="Accounts">Accounts</option>
            <option value="Supplier">Supplier</option>
            <option value="Customer">Customer</option>
            <option value="Transfer">Transfer</option>
          </select>
        </div>
        <div className="uk-width-1-4@s">
          <label htmlFor="">Date From</label>
          <input
            className="uk-input"
            type="date"
            placeholder="25"
            aria-label="25"
          />
        </div>
        <div className="uk-width-1-4@s">
          <label htmlFor="">Date To</label>
          <input
            className="uk-input"
            type="date"
            placeholder="25"
            aria-label="25"
          />
        </div>
        <div className="uk-width-1-1@s">
          <select className="uk-input" placeholder="50" aria-label="50">
            <option value="">Select Account</option>
            {/* {store} */}
          </select>
        </div>
      </form>
    </div>
  );
});
