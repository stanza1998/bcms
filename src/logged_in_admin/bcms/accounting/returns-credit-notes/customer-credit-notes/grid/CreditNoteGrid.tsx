import React from "react";
import { observer } from "mobx-react-lite";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { ICreditNote } from "../../../../../../shared/models/credit-notes-returns/CreditNotesReturns";
import { IUnit } from "../../../../../../shared/models/bcms/Units";
import { nadFormatter } from "../../../../../shared/NADFormatter";

interface IProp {
  data: ICreditNote[];
  units: IUnit[];
}

const CreditNoteGrid = observer(({ data, units }: IProp) => {
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 270,
    },
    {
      field: "unitId",
      headerName: "Customer (Unit)",
      width: 270,
      renderCell: (params) => {
        const unit = units.find((unit) => unit.id === params.row.unitId);
        return <>{unit ? "Unit " + unit.unitName : "Unknown"}</>;
      },
    },
    {
      field: "balance",
      headerName: "balance",
      width: 270,
      renderCell: (params) => <> {nadFormatter.format(params.row.balance)}</>,
    },
    {
      field: "customerReference",
      headerName: "Customer Reference",
      width: 270,
    },
  ];
  return (
    <Box sx={{ height: 350 }} className="invoices-grid">
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id} // Use the appropriate identifier property
        rowHeight={40}
      />
    </Box>
  );
});

export default CreditNoteGrid;
