import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { IUser } from "../../../../../../shared/interfaces/IUser";

interface IProp {
  data: IUser[];
}

const OwnerContactsGrid = observer(({ data }: IProp) => {
  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      renderCell: (params) => (
        <span style={{ textTransform: "uppercase" }}>
          {params.row.firstName}
        </span>
      ),
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      renderCell: (params) => (
        <span style={{ textTransform: "uppercase" }}>
          {params.row.lastName}
        </span>
      ),
    },

    {
      field: "cellphone",
      headerName: "Cellphone Number",
      flex: 1,
      renderCell: (params) => {
        return `0${params.row.cellphone}`;
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
        getRowId={(row) => row.uid} // Use the appropriate identifier property
        rowHeight={40}
      />
    </Box>
  );
});

export default OwnerContactsGrid;
