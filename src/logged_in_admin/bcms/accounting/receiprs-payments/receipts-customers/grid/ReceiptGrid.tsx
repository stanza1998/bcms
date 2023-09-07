import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import React from "react";
import { CorporateCard } from "../../../../bodyCorperates/BodyCorporate/CorporateCard";
import { Box } from "@mui/material";

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

const ReceiptGrid = observer(({ data }: IProp) => {
  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", width: 140 },
    { field: "rcp", headerName: "Doc No", width: 140 },
    { field: "reference", headerName: "Reference", width: 140 },
    { field: "transactionType", headerName: "Transaction Type", width: 140 },
    { field: "description", headerName: "Description", width: 140 },
    { field: "debit", headerName: "Debit", width: 140 },
    { field: "credit", headerName: "Credit", width: 140 },
    { field: "balance", headerName: "Balance", width: 0 },
  ];

  return (
    <Box sx={{ height: 400 }} className="invoices-grid">
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id} // Use the appropriate identifier property
        rowHeight={50}
      />
    </Box>
  );
});

export default ReceiptGrid;
