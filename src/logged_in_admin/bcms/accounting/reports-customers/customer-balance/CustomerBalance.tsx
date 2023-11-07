import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import Toolbar2 from "../../../../shared/Toolbar2";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";
import { useAppContext } from "../../../../../shared/functions/Context";
import CustomerBalanceGrid, {
  IAgingAnalysis,
} from "./grid/CustomerBalanceGrid";

const CustomerBalance = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const invoices = store.bodyCorperate.copiedInvoices.all
    .filter((inv) => inv.asJson.totalPaid < inv.asJson.totalDue)
    .map((inv) => {
      return inv.asJson;
    });

  const now = new Date(); // Get the current date

  // Define an object to store totals for each category per unit
  const unitAgingTotals: Record<string, Record<string, number>> = {};

  invoices.forEach((invoice) => {
    const unitId = invoice.unitId;
    const totalDue = invoice.totalDue - invoice.totalPaid;
    const dueDate = new Date(invoice.dueDate);

    if (!unitAgingTotals[unitId]) {
      unitAgingTotals[unitId] = {
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
      unitAgingTotals[unitId].current += totalDue;
    } else if (differenceInDays <= 60) {
      // Changed the condition here
      unitAgingTotals[unitId].days30 += totalDue;
    } else if (differenceInDays <= 90) {
      // Changed the condition here
      unitAgingTotals[unitId].days60 += totalDue;
    } else if (differenceInDays <= 120) {
      // Changed the condition here
      unitAgingTotals[unitId].days90 += totalDue;
    } else {
      unitAgingTotals[unitId].days120Plus += totalDue;
    }
  });

  const unitAgingTotalsArray: IAgingAnalysis[] = Object.entries(
    unitAgingTotals
  ).map(([unitId, agingData]) => {
    return { unitId, ...agingData } as IAgingAnalysis;
  });

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year)
        await api.body.copiedInvoice.getAll(me?.property, me?.year);
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
      <CustomerBalanceGrid data={unitAgingTotalsArray} />
    </div>
  );
});

export default CustomerBalance;
