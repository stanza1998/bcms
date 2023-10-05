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
      width: 265,
    },
    {
      field: "lastName",
      headerName: "LastName",
      width: 265,
    },

    {
      field: "cellphone",
      headerName: "Cellphone Number",
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
        getRowId={(row) => row.uid} // Use the appropriate identifier property
        rowHeight={40}
      />
    </Box>
  );
});

export default OwnerContactsGrid;
