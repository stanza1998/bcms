import React from "react";
import SupplierModel from "../../../../shared/models/Types/Suppliers";
import { observer } from "mobx-react-lite";

interface IProps {
  suppliers: SupplierModel[];
}

export const Suppliers = observer((props: IProps) => {
  const { suppliers } = props;
  return (
    <div>
      <table className="uk-table uk-table-small uk-table-divider">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
       
     
      </table>
    </div>
  );
});
