import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../../../shared/functions/Context";
import showModalFromId from "../../../../../../shared/functions/ModalShow";
import { IUnit } from "../../../../../../shared/models/bcms/Units";
import { IAnnouncements } from "../../../../../../shared/models/communication/announcements/AnnouncementModel";
import DIALOG_NAMES from "../../../../../dialogs/Dialogs";
import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { nadFormatter } from "../../../../../shared/NADFormatter";

interface IProp {
  data: IUnit[];
}

const UnitsGrid = observer(({ data }: IProp) => {
  const { store, api } = useAppContext();
  const owners = store.user.all.filter((o) => o.role === "Owner");

  const filteredUnits = store.bodyCorperate.unit.all
    .sort((a, b) => a.asJson.unitName - b.asJson.unitName)
    .map((unit) => {
      return unit.asJson;
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
      field: "unitName",
      headerName: "Units",
      width: 150,
    },
    {
      field: "firstName",
      headerName: "Owner Name",
      width: 150,
      renderCell: (params) => (
        <>
          {owners
            .filter((owner) => owner.uid === params.row.ownerId)
            .map((owner) => {
              return owner.asJson.firstName + " " + owner.asJson.lastName;
            })}
        </>
      ),
    },
    {
      field: "email",
      headerName: "Owner Email",
      width: 150,
      renderCell: (params) => (
        <>
          {owners
            .filter((owner) => owner.uid === params.row.ownerId)
            .map((owner) => {
              return owner.email;
            })}
        </>
      ),
    },
    {
      field: "cellphone",
      headerName: "Owner Phone",
      width: 130,
      renderCell: (params) => (
        <>
          {owners
            .filter((owner) => owner.uid === params.row.ownerId)
            .map((owner) => {
              return owner.cellphone;
            })}
        </>
      ),
    },
    {
      field: "balance",
      headerName: "Balance",
      width: 130,
      renderCell: (params) => <>{nadFormatter.format(params.row.balance)}</>,
    },
    {
      field: "Action",
      headerName: "Action",
      renderCell: (params) => (
        <div>
          <button
            className="uk-margin-right uk-icon"
            data-uk-icon="pencil"
            onClick={() => onUpdate(params.row)}
          >
          </button>
          <button
            className="uk-margin-right uk-icon"
            data-uk-icon="thumbnail"
            onClick={() => onView(params.row)}
          >
          </button>
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
export default UnitsGrid;
