import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import OwnerContactsGrid from "./grid/OwnersContactGrid";
import { useAppContext } from "../../../../../shared/functions/Context";

export const OwnerContacts = observer(() => {
  const { store, api } = useAppContext();
  const user = store.user.all
    .filter((u) => u.asJson.role === "Owner")
    .map((u) => {
      return u.asJson;
    });

  useEffect(() => {
    const getUsers = async () => {
      await api.auth.loadAll();
    };
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <OwnerContactsGrid data={user} />
    </div>
  );
});
