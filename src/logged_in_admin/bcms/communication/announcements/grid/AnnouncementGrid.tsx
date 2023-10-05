import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { IAnnouncements } from "../../../../../shared/models/communication/announcements/AnnouncementModel";
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { useEffect } from "react";

interface IProp {
  data: IAnnouncements[];
}

const AnnouncementGrid = observer(({ data }: IProp) => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const users = store.user.all.map((user) => {
    return user.asJson;
  });

  const onUpdate = (announcement: IAnnouncements) => {
    const announce = store.communication.announcements.select(announcement);
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_ANNOUNCEMENTS_DIALOG);
  };
  const onView = (announcement: IAnnouncements) => {
    const view = store.communication.announcements.select(announcement);
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
      field: "title",
      headerName: "Title",
      width: 150,
    },
    {
      field: "dateAndTime",
      headerName: "Date",
      width: 150,
    },
    {
      field: "authorOrSender",
      headerName: "Author/Sender",
      width: 150,
      renderCell: (params) => (
        <>
          {users
            .filter((u) => u.uid === params.row.authorOrSender)
            .map((user) => {
              return user.firstName + " " + user.lastName;
            })}
        </>
      ),
    },
    {
      field: "message",
      headerName: "Message",
      width: 180,
    },
    {
      field: "expiryDate",
      headerName: "Exipiry Date",
      width: 180,
    },
    {
      field: "priorityLevel",
      headerName: "Priority Level",
      width: 180,
    },
    {
      field: "Action",
      headerName: "Action",
      renderCell: (params) => (
        <div>
          <button onClick={() => onUpdate(params.row)}>edit</button>
          <button onClick={() => onView(params.row)}>view message</button>
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

export default AnnouncementGrid;
