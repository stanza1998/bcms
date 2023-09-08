import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useEffect } from "react";
import InvoicesGrid from "./invoices-grid";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";

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
      <InvoicesGrid data={invoicesC} />
    </div>
  );
});
