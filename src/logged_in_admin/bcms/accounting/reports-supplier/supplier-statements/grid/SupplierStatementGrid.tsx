import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { nadFormatter } from "../../../../../shared/NADFormatter";
import { ISupplierTransactions } from "../../../../../../shared/models/transactions/supplier-transactions/SupplierTransactions";

interface IProp {
  data: ISupplierTransactions[];
}

const SupplierStatementGrid = observer(({ data }: IProp) => {
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 150,
    },
    {
      field: "reference",
      headerName: "Reference",
      width: 150,
    },
    {
      field: "transactionType",
      headerName: "Transaction Type",
      width: 150,
    },
    {
      field: "description",
      headerName: "Description",
      width: 180,
    },
    {
      field: "debit",
      headerName: "Debit",
      width: 150,
      renderCell: (params) => <>{nadFormatter.format(params.row.debit)}</>,
    },
    {
      field: "credit",
      headerName: "Credit",
      width: 150,
      renderCell: (params) => <>{nadFormatter.format(params.row.credit)}</>,
    },
  ];

  return (
    <Box sx={{ height: 350 }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id} // Use the appropriate identifier property
        rowHeight={40}
      />
    </Box>
  );
});

export default SupplierStatementGrid;
