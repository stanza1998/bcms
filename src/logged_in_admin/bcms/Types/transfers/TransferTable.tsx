import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import { FailedAction } from "../../../../shared/models/Snackbar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { INormalAccount } from "../../../../shared/models/Types/Account";
import { ITransfer } from "../../../../shared/models/Types/Transfer";

interface IProp {
  data: ITransfer[];
}

export const TransferTable = observer(({ data }: IProp) => {
  const { store, api, ui } = useAppContext();
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 400 },
    { field: "description", headerName: "Description", width: 400 },
  ];

  return (
    <>
      <Box sx={{ height: 450 }} className="companies-grid">
        <DataGrid
          rows={data}
          //   columns={column}
          columns={columns}
          //   getRowId={(row) => row.id}
          rowHeight={50}
        />
      </Box>
    </>
  );
});
