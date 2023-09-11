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
    { field: "name", headerName: "Name", width: 300 },
    {
      field: "category",
      headerName: "Category",
      width: 300,
      renderCell: (params) => {
        const category = categories.find((c) => c.id === params.row.category);
        return <>{category ? category.name : "Unknown"}</>;
      },
    },
    { field: "description", headerName: "Description", width: 300 },
    { field: "balance", headerName: "Balance", width: 100 },
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
