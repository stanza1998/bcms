import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { INormalAccount } from "../../../../shared/models/Types/Account";
import { IAccountCategory } from "../../../../shared/models/Types/AccountCategories";

interface IProp {
  data: INormalAccount[];
  categories: IAccountCategory[];
}

export const AccountTable = observer(({ data, categories }: IProp) => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex:1 },
    {
      field: "category",
      headerName: "Category",
      flex:1,
      renderCell: (params) => {
        const category = categories.find((c) => c.id === params.row.category);
        return <>{category ? category.name : "Unknown"}</>;
      },
    },
    { field: "description", headerName: "Description", flex:1 },
    { field: "balance", headerName: "Balance", flex:1 },
  ];

  return (
    <>
      <Box sx={{ height: 350 }} className="companies-grid">
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
