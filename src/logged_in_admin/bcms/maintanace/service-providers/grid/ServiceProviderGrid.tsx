import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import { IAnnouncements } from "../../../../../shared/models/communication/announcements/AnnouncementModel";
import { IServiceProvider } from "../../../../../shared/models/maintenance/service-provider/ServiceProviderModel";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";

interface IProp {
    data: IServiceProvider[];
  }
  
  const ProviderGrid = observer(({ data }: IProp) => {
    const { store, api } = useAppContext();
  
    const onUpdate = (providers: IServiceProvider) => {
      store.maintenance.servie_provider.select(providers);
      showModalFromId(DIALOG_NAMES.MAINTENANCE.UPDATE_SERVICE_PROVIDER);
    };
    const onDelete = (providers: IServiceProvider) => {
      store.maintenance.servie_provider.select(providers);
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
        field: "serviceProvideName",
        headerName: "Service Provider Name",
        flex: 1,
      },
      {
        field: "phoneNumber",
        headerName: "Phone Number",
        flex: 1,
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1,
      },
      {
        field: "dateCreated",
        headerName: "Date Created",
        flex: 1,
      },
      {
        field: "specializationi",
        headerName: "Specialisation",
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
              data-uk-icon="trash"
              onClick={() => onDelete(params.row)}
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
  
  export default ProviderGrid;
  