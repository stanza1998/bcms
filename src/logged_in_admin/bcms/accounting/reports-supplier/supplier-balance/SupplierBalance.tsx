import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import Toolbar2 from "../../../../shared/Toolbar2";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";
import { useAppContext } from "../../../../../shared/functions/Context";
import SupplierBalanceGrid, {
  IAgingAnalysisSupplier,
} from "./grid/SupplierBalanceGrid";

const SupplierBalance = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const invoices = store.bodyCorperate.supplierInvoice.all
    .filter((inv) => inv.asJson.totalPaid < inv.asJson.totalDue)
    .map((inv) => {
      return inv.asJson;
    });

  const now = new Date(); // Get the current date

  // Define an object to store totals for each category per unit
  const unitAgingTotals: Record<string, Record<string, number>> = {};

  invoices.forEach((invoice) => {
    const supplierId = invoice.supplierId;
    const totalDue = invoice.totalDue - invoice.totalPaid;
    const dueDate = new Date(invoice.dueDate);

    if (!unitAgingTotals[supplierId]) {
      unitAgingTotals[supplierId] = {
        current: 0,
        days30: 0,
        days60: 0,
        days90: 0,
        days120Plus: 0,
      };
    }

    // Calculate the difference in days
    const differenceInDays = Math.floor(
      (now.getTime() - dueDate.getTime()) / (1000 * 3600 * 24)
    );

    if (differenceInDays <= 30) {
      unitAgingTotals[supplierId].current += totalDue;
    } else if (differenceInDays <= 60) {
      unitAgingTotals[supplierId].days30 += totalDue;
    } else if (differenceInDays <= 90) {
      unitAgingTotals[supplierId].days60 += totalDue;
    } else if (differenceInDays <= 120) {
      unitAgingTotals[supplierId].days90 += totalDue;
    } else {
      unitAgingTotals[supplierId].days120Plus += totalDue;
    }
  });

  const supplierAgingTotalsArray: IAgingAnalysisSupplier[] = Object.entries(
    unitAgingTotals
  ).map(([supplierId, agingData]) => {
    return { supplierId, ...agingData } as IAgingAnalysisSupplier;
  });

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year)
        await api.body.supplierInvoice.getAll(me?.property, me?.year);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Toolbar2
        leftControls={<div className=""></div>}
        rightControls={
          <div>
            <IconButton uk-tooltip="Print Aging Analysis">
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
      <SupplierBalanceGrid data={supplierAgingTotalsArray} />
    </div>
  );
});

export default SupplierBalance;
