import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../../dialogs/Dialogs";
import { ISupplierInvoices } from "../../../../../../shared/models/invoices/SupplierInvoice";
import {
  FailedAction,
  SuccessfulAction,
} from "../../../../../../shared/models/Snackbar";
import Modal from "../../../../../../shared/components/Modal";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../../../../shared/models/bcms/BodyCorperate";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../../shared/database/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  ISupplier,
  defaultSupplier,
} from "../../../../../../shared/models/Types/Suppliers";
import { IReceiptsPayments } from "../../../../../../shared/models/receipts-payments/ReceiptsPayments";
import { PaymentGrid } from "./grid/PaymentGrid";

export const NEDBANKCreate = observer(() => {
  const { store, api } = useAppContext();
  const [supplierId, setSupplierId] = useState<string>("");
  const me = store.user.meJson;

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year && me?.month)
        await api.body.receiptPayments.getAll(me.property, me.year, me.month);
      await api.body.body.getAll();
      if (me?.property) await api.body.supplier.getAll(me.property);
    };
    getData();
  }, [me?.property]);

  const accounts = store.bodyCorperate.supplier.all.map((p) => {
    return p.asJson;
  });

  const transactions = store.bodyCorperate.receiptsPayments.all
    .filter((t) => t.asJson.supplierId === supplierId)
    .map((t) => {
      return t.asJson;
    });

  return (
    <div>
      <div>
        <br />
        <label htmlFor="">Select Supplier Account</label>
        <br />
        <select
          name=""
          id=""
          className="uk-input"
          onChange={(e) => setSupplierId(e.target.value)}
          style={{ width: "30%" }}
        >
          <option value="">Select Supplier Account</option>
          {accounts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} , {p.description}
            </option>
          ))}
        </select>
      </div>
      <br />
      <br />
      <PaymentGrid supplierId={supplierId} data={transactions} />
    </div>
  );
});
