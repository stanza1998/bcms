import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { nadFormatter } from "../../../../../shared/NADFormatter";
import { ICustomerStatements } from "../CustomerStatements";

interface IProp {
  data: ICustomerStatements[];
}

const CustomerStatementGrid = observer(({ data }: IProp) => {
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 200,
    },
    {
      field: "reference",
      headerName: "Reference",
      width: 250,
    },

    {
      field: "description",
      headerName: "Description",
      width: 250,
    },
    {
      field: "debit",
      headerName: "Debit",
      width: 190,
      renderCell: (params) => <>{nadFormatter.format(params.row.debit)}</>,
    },
    {
      field: "credit",
      headerName: "Credit",
      width: 190,
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

export default CustomerStatementGrid;
