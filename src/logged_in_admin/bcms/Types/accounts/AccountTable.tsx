import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { INormalAccount } from "../../../../shared/models/Types/Account";
import { IAccountCategory } from "../../../../shared/models/Types/AccountCategories";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import EditIcon from "@mui/icons-material/Edit";

interface IProp {
  data: INormalAccount[];
  categories: IAccountCategory[];
}

export const AccountTable = observer(({ data, categories }: IProp) => {
  const { store } = useAppContext();

  const onUpdate = (account: INormalAccount) => {
    store.bodyCorperate.account.select(account);
    showModalFromId(DIALOG_NAMES.ACCOUNTING_FINANCE_DIALOG.ACCOUNTS_EDIT);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      renderCell: (params) => {
        const category = categories.find((c) => c.id === params.row.category);
        return <>{category ? category.name : "Unknown"}</>;
      },
    },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "balance", headerName: "Balance", flex: 1 },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => onUpdate(params.row)}>
            <EditIcon />
          </IconButton>
          {/* <IconButton>Delete</IconButton> */}
        </>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ height: 500 }} className="companies-grid">
        <DataGrid
          rows={data}
          //   columns={column}
          columns={columns}
          //   getRowId={(row) => row.id}
          rowHeight={40}
        />
      </Box>
    </>
  );
});
