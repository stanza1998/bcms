import React from "react";
import { observer } from "mobx-react-lite";
import AccountModel from "../../../../shared/models/Types/Account";
import { AccountTable } from "./AccountTable";

interface IProps {
  accounts: AccountModel[];
}

export const Accounts = observer((props: IProps) => {
  const { accounts } = props;
  return (
    <div>
      <table className="uk-table uk-table-small uk-table-divider">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {/* {accounts.map((s) => (
            <AccountTable key={s.asJson.id} account={s} />
          ))} */}
        </tbody>
      </table>
    </div>
  );
});
