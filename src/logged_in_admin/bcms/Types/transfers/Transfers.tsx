import React from "react";
import { observer } from "mobx-react-lite";
import TransferModel from "../../../../shared/models/Types/Transfer";
import { TransferTable } from "./TransferTable";

interface IProps {
  transfers: TransferModel[];
}

export const Transfers = observer((props: IProps) => {
  const { transfers } = props;
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
   
        </tbody>
      </table>
    </div>
  );
});
