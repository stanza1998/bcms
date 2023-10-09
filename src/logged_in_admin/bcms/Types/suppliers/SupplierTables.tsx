import React from "react";
import { observer } from "mobx-react-lite";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { ISupplier } from "../../../../shared/models/Types/Suppliers";
import { nadFormatter } from "../../../shared/NADFormatter";

interface IProp {
  data: ISupplier[];
}

export const SupplierTable = observer(({ data }: IProp) => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "telephoneNumber", headerName: "Telephone Number", flex: 1 },
    { field: "mobileNumber", headerName: "Mobile Number", flex: 1 },
    {
      field: "balance",
      headerName: "Balance",
      width: 200,
      renderCell: (params) => nadFormatter.format(params.row.balance),
    },
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
