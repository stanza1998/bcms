import React from "react";
import { ICustomContact } from "../../../../../../shared/models/communication/contact-management/CustomContacts";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { observer } from "mobx-react-lite";
import showModalFromId from "../../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../../dialogs/Dialogs";
import EditIcon from '@mui/icons-material/Edit';

interface IProp {
  data: ICustomContact[];
}

export const CustomerContactsGrid = observer(({ data }: IProp) => {
  const { store, api } = useAppContext();

  const onUpdate = (contact: ICustomContact) => {
    const _contact = store.communication.customContacts.select(contact);
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_CUSTOM_CONTACT);
  };

  //setting it as string?g
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex:1,
    },
    {
      field: "email",
      headerName: "Email Address",
      flex:1,
    },

    {
      field: "cellTell",
      headerName: "Phone Number",
      flex:1,
    },
    {
      field: "cityTown",
      headerName: "City Or Town",
      flex:1,
    },
    {
      field: "location",
      headerName: "Location",
      flex:1,
    },
    {
      field: "Action",
      headerName: "Action",
      flex:1,
      renderCell: (params) => (
        <IconButton onClick={() => onUpdate(params.row)}><EditIcon /></IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ height: 350 }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id} // Use the appropriate identifier property
        rowHeight={40}
      />
    </Box>
  );
});
