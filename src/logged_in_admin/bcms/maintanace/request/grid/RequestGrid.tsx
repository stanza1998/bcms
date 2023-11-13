import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import { IMaintenanceRequest } from "../../../../../shared/models/maintenance/request/maintenance-request/MaintenanceRequest";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { useNavigate } from "react-router-dom";

interface IProp {
  data: IMaintenanceRequest[];
}

const RequestGrid = observer(({ data }: IProp) => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const navigate = useNavigate();

  const viewWorkOrderFlow = (maintenanceRequestId: string) => {
    navigate(`/c/maintainance/request/${maintenanceRequestId}`);
  };

  const users = store.user.all.map((user) => {
    return user.asJson;
  });

  const units = store.bodyCorperate.unit.all.map((unit) => {
    return unit.asJson;
  });

  const onUpdate = (MaintenanceRequest: IMaintenanceRequest) => {
    store.maintenance.maintenance_request.select(MaintenanceRequest);
    showModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_MAINTENANCE_REQUEST); //create update dialog
  };
  const onView = (MaintenanceRequest: IMaintenanceRequest) => {
    store.maintenance.maintenance_request.select(MaintenanceRequest);
    showModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_MAINTENANCE_REQUEST); //create view dialog
  };

  useEffect(() => {
    const getUsers = async () => {
      await api.auth.loadAll();
      if (me?.property) {
        await api.unit.getAll(me.property);
      }
    };
    getUsers();
  }, [api.auth, api.unit, me?.property]);

  const columns: GridColDef[] = [
    {
      field: "ownerId",
      headerName: "Owner",
      flex: 1,
      renderCell: (params) => {
        const ownerId = params.value; // Assuming ownerId is a property in your data

        // Find the user with the specified ownerId
        const owner = users.find((user) => user.uid === ownerId);

        return (
          <span style={{ textTransform: "uppercase" }}>
            {owner ? owner.firstName + " " + owner.lastName : "Unknown"}
          </span>
        );
      },
    },
    {
      field: "unitId",
      headerName: "Unit",
      flex: 1,
      renderCell: (params) => {
        const unitId = params.value; // Assuming ownerId is a property in your data

        // Find the user with the specified ownerId
        const unit = units.find((unit) => unit.id === unitId);

        return (
          <span style={{ textTransform: "uppercase" }}>
            {unit ? "Unit " + unit.unitName : "Unknown"}
          </span>
        );
      },
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
        if (params.row.status === "Pending") {
          return (
            <span
              style={{
                background: "red",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              {params.row.status}
            </span>
          );
        } else if (params.row.status === "In Progress") {
          return (
            <span
              style={{
                background: "orange",
                color: "black",
                padding: "10px",
                width: "100%",
              }}
            >
              {params.row.status}
            </span>
          );
        } else if (params.row.status === "Closed") {
          return (
            <span
              style={{
                background: "grey",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              {params.row.status}{" "}
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
              {params.row.status}{" "}
            </span>
          );
        }
      },
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div>
          <button
            className="uk-margin-right uk-icon"
            data-uk-icon="pencil"
            onClick={() => onUpdate(params.row)}
          ></button>
          <button
            className="uk-margin-right uk-icon"
            data-uk-icon="thumbnails"
            onClick={() => viewWorkOrderFlow(params.row.id)}
          ></button>
          {/* <button
              className="uk-margin-right uk-icon"
              data-uk-icon="trash"
              onClick={() => viewWorkOrderFlow(params.row.id)}
            ></button> */}
        </div>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500 }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id}
        rowHeight={40}
      />
    </Box>
  );
});

export default RequestGrid;
