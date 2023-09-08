import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import React from "react";
import { Box } from "@mui/material";
import { IReceiptsPayments } from "../../../../../../shared/models/receipts-payments/ReceiptsPayments";



interface IProp {
  data: IReceiptsPayments[];
}

const PaymentGrid = observer(({ data }: IProp) => {
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
    <Box sx={{ height: 350 }} className="invoices-grid">
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id} // Use the appropriate identifier property
        rowHeight={40}
      />
    </Box>
  );
});

export default PaymentGrid;
