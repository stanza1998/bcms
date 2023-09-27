import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useEffect } from "react";
import InvoicesGrid from "./invoices-grid";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";
import Toolbar2 from "../../../../shared/Toolbar2";
import { nadFormatter } from "../../../../shared/NADFormatter";
import ArrowCircleUpSharpIcon from "@mui/icons-material/ArrowCircleUpSharp";
import ArrowCircleDownSharpIcon from "@mui/icons-material/ArrowCircleDownSharp";

export const CopiedInvoices = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  useEffect(() => {
    const getData = async () => {
      await api.body.body.getAll();
      if (me?.property && me.year)
        await api.body.copiedInvoice.getAll(me.property, me.year);
      if (me?.property) await api.body.financialYear.getAll(me.property);
      if (me?.property && me?.year)
        await api.body.financialMonth.getAll(me.property, me.year);
      await api.auth.loadAll();
    };
    getData();
  }, [
    api.auth,
    api.body.body,
    api.body.copiedInvoice,
    api.body.financialMonth,
    api.body.financialYear,
    api.unit,
    me?.property,
    me?.year,
  ]);

  const invoicesC = store.bodyCorperate.copiedInvoices.all.map((statements) => {
    return statements.asJson;
  });

  const sortedInvoices = invoicesC.sort(
    (a, b) =>
      new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
  );

  const totalDue = invoicesC.reduce(
    (amount, invoice) => amount + invoice.totalDue,
    0
  );

  const totalPaid = invoicesC.reduce(
    (amount, invoice) => amount + invoice.totalPaid,
    0
  );

  const formattedTotalDue = nadFormatter.format(totalDue);
  const formattedTotalPaid = nadFormatter.format(totalPaid);

  return (
    <div>
      <Toolbar2
        leftControls={
          <div className="">
            <span className="uk-margin-right" style={{ fontSize: "18px" }}>
              <ArrowCircleDownSharpIcon style={{ color: "red" }} /> Total
              Amount: {formattedTotalDue}
            </span>
            <span style={{ fontSize: "18px" }}>
              <ArrowCircleUpSharpIcon style={{ color: "green" }} /> Total Paid:{" "}
              {formattedTotalPaid}
            </span>
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

      <InvoicesGrid data={sortedInvoices} />
    </div>
  );
});
