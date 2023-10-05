import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import SupplierContactsGrid from "./grid/SupplierContactsGrid";

export const SupplierContacts = observer(() => {
  const { store, api } = useAppContext();
  const supplier = store.bodyCorperate.supplier.all.map((u) => {
    return u.asJson;
  });
  const me = store.user.meJson;

  useEffect(() => {
    const getData = async () => {
      if (me?.property) await api.body.supplier.getAll(me.property);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <SupplierContactsGrid data={supplier} />
    </div>
  );
});
