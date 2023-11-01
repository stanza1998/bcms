import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { ISupplier } from "../../../../../../shared/models/Types/Suppliers";

interface IProp {
  data: ISupplier[];
}

const SupplierContactsGrid = observer(({ data }: IProp) => {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Supplier Name",
      flex: 1,
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      flex: 1,
      renderCell: (params) => <span>+264 {params.row.mobileNumber}</span>,
    },

    {
      field: "telephoneNumber",
      headerName: "Telephone Number",
      flex: 1,
      renderCell: (params) => {
        return `+264 ${params.row.telephoneNumber}`;
      },
    },
    {
      field: "email",
      headerName: "Email Address",
      flex: 1,
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

export default SupplierContactsGrid;
