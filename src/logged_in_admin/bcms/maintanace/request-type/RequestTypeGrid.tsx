import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { IRequestType } from "../../../../shared/models/maintenance/request/maintenance-request/types/RequestTypes";


interface IProp {
  data: IRequestType[];
}

const RequestTypeGrid = observer(({ data }: IProp) => {
  const { store } = useAppContext();

  const columns: GridColDef[] = [
    {
      field: "typeName",
      headerName: "Type Name",
      width: 200,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 0,

    },
  ];

  return (
    <Box sx={{ height: 500 }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id} // Use the appropriate identifier property
        rowHeight={50}
      />
    </Box>
  );
});

export default RequestTypeGrid;
