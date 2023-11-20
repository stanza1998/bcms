import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import { IMaintenanceRequest } from "../../../shared/models/maintenance/request/maintenance-request/MaintenanceRequest";
import DIALOG_NAMES from "../../dialogs/Dialogs";

interface IProp {
  data: IMaintenanceRequest[];
}

const OverviewRequests = observer(({ data }: IProp) => {
  const { store, api } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      await api.auth.loadAll();
    };
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: GridColDef[] = [
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "dateRequested",
      headerName: "Date Requested",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        if (params.row.status === "Closed") {
          return (
            <span
              style={{
                background: "grey",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              {params.row.status}
            </span>
          );
        } else if (params.row.status === "Opened") {
          return (
            <span
              style={{
                background: "blue",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              {params.row.status}
            </span>
          );
        } else if (params.row.status === "Completed") {
          return (
            <span
              style={{
                background: "green",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              {params.row.status}{" "}
            </span>
          );
        }
      },
    },
  ];

  return (
    <Box sx={{ height: 300 }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id}
        rowHeight={40}
      />
    </Box>
  );
});

export default OverviewRequests;
