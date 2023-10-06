import React from "react";
import { ICustomContact } from "../../../../../../shared/models/communication/contact-management/CustomContacts";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { observer } from "mobx-react-lite";
import showModalFromId from "../../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../../dialogs/Dialogs";

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
      width: 160,
    },
    {
      field: "email",
      headerName: "Email Address",
      width: 160,
    },

    {
      field: "cellTell",
      headerName: "Cell Or Telephone Number",
      width: 160,
    },
    {
      field: "cityTown",
      headerName: "City Or Town",
      width: 160,
    },
    {
      field: "location",
      headerName: "Location",
      width: 160,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 160,
      renderCell: (params) => (
        <IconButton onClick={() => onUpdate(params.row)}>jksdjkds</IconButton>
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
