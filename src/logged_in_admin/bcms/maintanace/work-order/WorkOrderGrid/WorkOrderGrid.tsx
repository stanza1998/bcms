
import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import { IMaintenanceRequest } from "../../../../../shared/models/maintenance/request/maintenance-request/MaintenanceRequest";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { useNavigate } from "react-router-dom";
import { IWorkOrderFlow } from "../../../../../shared/models/maintenance/request/work-order-flow/WorkOrderFlow";

interface IProp {
    data: IWorkOrderFlow[];
  }
  
  const WorkOrderGrid = observer(({ data }: IProp) => {
    const { store, api } = useAppContext();
    const navigate = useNavigate();

    const users = store.user.all.map((user) => {
      return user.asJson;
    });
  
    const onUpdate = (workOrder: IWorkOrderFlow) => {
      store.maintenance.work_flow_order.select(workOrder);
      showModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_WORK_ORDER); //create update modal
    };
    const onView = (workOrder: IWorkOrderFlow) => {
    //   showModalFromId(DIALOG_NAMES.MAINTENANCE); //create view modal
    };
  
    useEffect(() => {
      const getUsers = async () => {
        await api.auth.loadAll();
      };
      getUsers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
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
              data-uk-icon="trash"
            //   onClick={() => viewWorkOrderFlow(params.row)}
            ></button>
          </div>
        ),
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
  
  export default WorkOrderGrid;
  