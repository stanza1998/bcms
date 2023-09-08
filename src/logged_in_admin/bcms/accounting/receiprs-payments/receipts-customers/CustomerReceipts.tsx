import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import ReceiptGrid from "./grid/ReceiptGrid";
import { IReceiptsPayments } from "../../../../../shared/models/receipts-payments/ReceiptsPayments";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";
import Toolbar2 from "../../../../shared/Toolbar2";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

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
      <Toolbar2
        leftControls={
          <div className="">
            <IconButton uk-tooltip="Create Customer Receipt">
              <CreateNewFolderIcon />
            </IconButton>
          </div>
        }
        rightControls={
          <div>
            <IconButton uk-tooltip="Print invoices">
              <PrintIcon />
            </IconButton>
            <IconButton uk-tooltip="Export to pdf">
              <PictureAsPdfIcon />
            </IconButton>
            <IconButton uk-tooltip="Export to csv">
              <ArticleIcon />
            </IconButton>
          </div>
        }
      />
      <ReceiptGrid data={rcp} />
    </div>
  );
});

export default CustomerReceipts;
