import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import React from "react";
import { Box } from "@mui/material";
import { IReceiptsPayments } from "../../../../../../shared/models/receipts-payments/ReceiptsPayments";
import { nadFormatter } from "../../../../../shared/NADFormatter";

interface IProp {
  data: IReceiptsPayments[];
}

const PaymentGrid = observer(({ data }: IProp) => {
  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "rcp", headerName: "Doc No", width: 150 },
    { field: "reference", headerName: "Reference", width: 150 },
    { field: "transactionType", headerName: "Transaction Type", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "debit", headerName: "Debit", width: 150 },
    {
      field: "credit",
      headerName: "Credit",
      renderCell: (params) => <> {nadFormatter.format(params.row.credit)}</>,
    },
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
