import { Box, IconButton } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import { IMaintenanceRequest } from "../../../../../shared/models/maintenance/request/maintenance-request/MaintenanceRequest";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { useNavigate, useParams } from "react-router-dom";
import { IWorkOrderFlow } from "../../../../../shared/models/maintenance/request/work-order-flow/WorkOrderFlow";
import PreviewIcon from "@mui/icons-material/Preview";
import Badge from "@mui/material/Badge";
import { getQuoteFilesLength } from "../../../../shared/common";
import CircleIcon from "@mui/icons-material/Circle";

interface IProp {
  data: IWorkOrderFlow[];
}

const WorkOrderGrid = observer(({ data }: IProp) => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const { maintenanceRequestId } = useParams();

  const orders = store.maintenance.work_flow_order.all.map((w) => {
    return w.asJson;
  });

  const onUpdate = (workOrder: IWorkOrderFlow) => {
    store.maintenance.work_flow_order.select(workOrder);
    showModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_WORK_ORDER); //create update modal
  };
  const onView = (workOrder: IWorkOrderFlow) => {
    store.maintenance.work_flow_order.select(workOrder);
    showModalFromId(DIALOG_NAMES.MAINTENANCE.VIEW_WORK_ORDER);
  };
  const onExtend = (workOrder: IWorkOrderFlow) => {
    store.maintenance.work_flow_order.select(workOrder);
    showModalFromId(DIALOG_NAMES.MAINTENANCE.EXTEND_WINDOW_PERIOD);
  };

  useEffect(() => {
    const getUsers = async () => {
      await api.auth.loadAll();
      if (me?.property && maintenanceRequestId) {
        await api.maintenance.work_flow_order.getAll(
          me.property,
          maintenanceRequestId
        );
      }
    };
    getUsers();
  }, [
    api.auth,
    api.maintenance.work_flow_order,
    maintenanceRequestId,
    me?.property,
  ]);

  const columns: GridColDef[] = [
    {
      field: "workOrderNumber",
      headerName: "Work Order Number",
      flex: 1,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
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
        } else if (params.row.status === "In-Progress") {
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
      field: "windowPeriod",
      headerName: "Window Period Status",
      flex: 1,
      renderCell: (params) => {
        const currentDate = Date.now();
        const endDate = new Date(params.row.windowPeriod).getTime();

        if (currentDate < endDate) {
          return (
            <span
              style={{
                background: "blue",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              Window Active
            </span>
          );
        } else if (currentDate > endDate) {
          return (
            <span
              style={{
                background: "grey",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              Window Expired
            </span>
          );
        }
      },
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        const id = params.row.id;

        return (
          <div>
            <IconButton
              onClick={() => onView(params.row)}
              data-uk-tooltip="View Quotations and choose Service Provider"
            >
              <Badge
                badgeContent={getQuoteFilesLength(id, orders)}
                color="secondary"
              >
                {" "}
                <PreviewIcon />
              </Badge>
            </IconButton>
            <IconButton
              data-uk-tooltip="Extend Window Period"
              onClick={() => onExtend(params.row)}
            >
              <CircleIcon />
            </IconButton>
            {/* <button
            className="uk-margin-right uk-icon"
            data-uk-icon="pencil"
            onClick={() => onUpdate(params.row)}
          ></button> */}
          </div>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 500 }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id} // Use the appropriate identifier property
        rowHeight={45}
      />
    </Box>
  );
});

export default WorkOrderGrid;
