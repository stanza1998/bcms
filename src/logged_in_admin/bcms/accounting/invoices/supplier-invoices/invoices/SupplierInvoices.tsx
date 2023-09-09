import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../../../shared/functions/Context";
import Toolbar2 from "../../../../../shared/Toolbar2";
import SupplierInvoicesGrid from "./SupplierGrid";

export const SupplierInvoices = observer(() => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();
  const me = store.user.meJson;

  useEffect(() => {
    const getData = async () => {
      if ((me?.property, me?.year))
        await api.body.supplierInvoice.getAll(me.property, me.year);
    };
    getData();
  }, [api.body.supplierInvoice, me?.property, me?.year]);

  const create = () => {
    navigate("/c/accounting/supplier-invoices/create");
  };

  const invoices = store.bodyCorperate.supplierInvoice.all.map((inv) => {
    return inv.asJson;
  });

  return (
    <div className="uk-section leave-analytics-page">
      <Toolbar2
        leftControls={
          <div className="">
            <IconButton uk-tooltip="Create Invoice" onClick={create}>
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
      <SupplierInvoicesGrid data={invoices} />
    </div>
  );
});
