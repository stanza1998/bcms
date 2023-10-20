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
      headerName: "FirstName",
      flex:1,
    },
    {
      field: "lastName",
      headerName: "LastName",
      flex:1,
    },

    {
      field: "cellphone",
      headerName: "Cellphone Number",
      flex:1,
      renderCell: (params) => {
        return `0${params.row.cellphone}`;
      },
    },
    {
      field: "email",
      headerName: "Email Address",
      flex:1,
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
