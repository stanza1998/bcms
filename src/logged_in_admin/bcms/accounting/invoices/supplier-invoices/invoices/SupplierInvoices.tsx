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
import { nadFormatter } from "../../../../../shared/NADFormatter";
import ArrowCircleUpSharpIcon from "@mui/icons-material/ArrowCircleUpSharp";
import ArrowCircleDownSharpIcon from "@mui/icons-material/ArrowCircleDownSharp";

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

  const sortedInvoices = invoices.sort(
    (a, b) =>
      new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
  );

  const totalBalance = invoices.reduce(
    (balance, invoice) => balance + invoice.totalDue,
    0
  );
  const totalPaid = invoices.reduce(
    (balance, invoice) => balance + invoice.totalPaid,
    0
  );

  const formattedTotal = nadFormatter.format(totalBalance);
  const formattedPaid = nadFormatter.format(totalPaid);

  return (
    <div className="uk-section leave-analytics-page">
      <Toolbar2
        leftControls={
          <>
            <span style={{ fontSize: "18px" }} className="uk-margin-right">
              <ArrowCircleDownSharpIcon style={{ color: "red" }} /> Total Due{" "}
              {formattedTotal}
            </span>
            <span style={{ fontSize: "18px" }} className="">
              <ArrowCircleUpSharpIcon style={{ color: "green" }} /> Total Paid{" "}
              {formattedPaid}
            </span>
          </>
        }
        rightControls={
          <div>
            <IconButton uk-tooltip="Create Invoice" onClick={create}>
              <CreateNewFolderIcon />
            </IconButton>
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
      <SupplierInvoicesGrid data={sortedInvoices} />
    </div>
  );
});
