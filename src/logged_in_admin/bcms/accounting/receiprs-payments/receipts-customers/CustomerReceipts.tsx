import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import ReceiptGrid from "./grid/ReceiptGrid";
import { IReceiptsPayments } from "../../../../../shared/models/receipts-payments/ReceiptsPayments";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";

const CustomerReceipts = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const [rcp, setRCP] = useState<Array<IReceiptsPayments>>([]);

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year && me?.month) {
        await api.body.receiptPayments.getAll(me.property, me?.year, me?.month);
        const rcp = store.bodyCorperate.receiptsPayments.all
          .filter((rcp) => rcp.asJson.transactionType === "Customer Receipt")
          .map((rcp) => {
            return rcp.asJson;
          });
        setRCP(rcp);
      }
    };
    getData();
  }, []);

  return (
    <div>
      <div className="uk-margin">
        <IconButton>
          <PrintIcon />
        </IconButton>
        <IconButton>
          <PictureAsPdfIcon />
        </IconButton>
        <IconButton>
          <ArticleIcon />
        </IconButton>
      </div>
      <ReceiptGrid data={rcp} />
    </div>
  );
});

export default CustomerReceipts;