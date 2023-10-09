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
      field: "title",
      headerName: "Title",
      flex:1,
    },
    {
      field: "dateAndTime",
      headerName: "Date",
      flex:1,
    },
    {
      field: "authorOrSender",
      headerName: "Author/Sender",
      flex:1,
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
      flex:1,
    },
    {
      field: "expiryDate",
      headerName: "Exipiry Date",
      flex:1,
    },
    {
      field: "priorityLevel",
      headerName: "Priority Level",
      flex:1,
      renderCell: (params) => {
        if (params.row.priorityLevel === "HIGH") {
          return (
            <span
              style={{
                background: "green",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              {params.row.priorityLevel}
            </span>
          );
        } else if (params.row.priorityLevel === "MEDIUM") {
          return (
            <span
              style={{
                background: "orange",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              {params.row.priorityLevel}
            </span>
          );
        } else if (params.row.priorityLevel === "LOW") {
          return (
            <span
              style={{
                background: "yellow",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              {params.row.priorityLevel}{" "}
            </span>
          );
        } else {
          return "no priority sert";
        }
      },
    },
    {
      field: "Status",
      headerName: "Status",
      flex:1,
      renderCell: (params) => {
        const expiryDate = new Date(params.row.expiryDate);
        const currentDate = new Date();

        if (expiryDate < currentDate) {
          // Announcement has expired
          return (
            <span
              style={{
                background: "red",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              Expired
            </span>
          );
        } else {
          // Announcement is still active
          return (
            <span
              style={{
                background: "green",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              Active
            </span>
          );
        }
      },
    },
    {
      field: "Action",
      headerName: "Action",
      flex:1,
      renderCell: (params) => (
        <div>
          <button className="uk-margin-right uk-icon" data-uk-icon="pencil" onClick={() => onUpdate(params.row)}></button>
          <button  className="uk-margin-right uk-icon" data-uk-icon="thumbnails"  onClick={() => onView(params.row)}></button>
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
