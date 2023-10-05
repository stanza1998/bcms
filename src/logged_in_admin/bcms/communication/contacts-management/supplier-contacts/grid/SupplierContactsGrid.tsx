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
      width: 265,
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      width: 265,
    },

    {
      field: "telephoneNumner",
      headerName: "Telephone Number",
      width: 265,
      renderCell: (params) => {
        return `0${params.row.cellphone}`;
      },
    },
    {
      field: "email",
      headerName: "Email Address",
      width: 265,
    },
  ];

  return (
    <Box sx={{ height: 500 }}>
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
