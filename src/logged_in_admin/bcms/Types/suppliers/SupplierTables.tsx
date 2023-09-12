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
    { field: "name", headerName: "Name", width: 230 },
    { field: "description", headerName: "Description", width: 230 },
    { field: "telephoneNumber", headerName: "Telephone Number", width: 230 },
    { field: "mobileNumber", headerName: "Mobile Number", width: 200 },
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
