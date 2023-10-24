import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import { IAnnouncements } from "../../../../../shared/models/communication/announcements/AnnouncementModel";
import { IMaintenanceRequest } from "../../../../../shared/models/maintenance/request/maintenance-request/MaintenanceRequest";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";

interface IProp {
    data: IMaintenanceRequest[];
  }
  
  const RequestGrid = observer(({ data }: IProp) => {
    const { store, api } = useAppContext();
  
    const users = store.user.all.map((user) => {
      return user.asJson;
    });
  
    const onUpdate = (announcement: IAnnouncements) => {
      store.communication.announcements.select(announcement);
      showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_ANNOUNCEMENTS_DIALOG);
    };
    const onView = (announcement: IAnnouncements) => {
      store.communication.announcements.select(announcement);
      showModalFromId(DIALOG_NAMES.COMMUNICATION.VIEW_ANNOUNCEMENT_DIALOG);
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
              onClick={() => onView(params.row)}
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
  
  export default RequestGrid;
  