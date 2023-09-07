import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import ReceiptGrid from "./grid/ReceiptGrid";

interface Statement {
  date: string;
  reference: string;
  transactionType: string;
  description: string;
  debit: string;
  credit: string;
  balance: number;
  id: string;
  propertyId: string;
  unitId: string;
  invoiceNumber: string;
  rcp: string;
}

interface IProp {
  data: Statement[];
}

const CustomerReceipts = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const [rcp, setRCP] = useState<Array<Statement>>([]);
  console.log(
    "🚀 ~ file: CustomerReceipts.tsx:28 ~ CustomerReceipts ~ rcp:",
    rcp
  );

  useEffect(() => {
    const transactions = store.bodyCorperate.fnb.all
      .filter((t) => t.asJson.unitId !== "")
      .map((t) => t.asJson);

    const statements = transactions.map((tr) => ({
      date: tr.date,
      reference: tr.references,
      transactionType: "Customer Receipt",
      description: tr.description,
      debit: tr.amount.toFixed(2),
      credit: "",
      balance: tr.balance,
      id: tr.id,
      propertyId: tr.propertyId,
      unitId: tr.unitId,
      invoiceNumber: tr.invoiceNumber,
      rcp: tr.rcp,
    }));

    setRCP(statements);
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year && me?.month)
        await api.body.fnb.getAll(me?.property, me?.year, me?.month);
    };
    getData();
  }, []);

  return (
    <div>
      <ReceiptGrid data={rcp} />
    </div>
  );
});

export default CustomerReceipts;
