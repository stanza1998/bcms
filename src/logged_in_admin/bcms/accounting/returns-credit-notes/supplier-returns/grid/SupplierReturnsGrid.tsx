import React from "react";
import { observer } from "mobx-react-lite";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { ICreditNote } from "../../../../../../shared/models/credit-notes-returns/CreditNotesReturns";
import { ISupplier } from "../../../../../../shared/models/Types/Suppliers";
import { ISupplierReturns } from "../../../../../../shared/models/credit-notes-returns/SupplierReturns";

interface IProp {
  data: ISupplierReturns[];
  suppliers: ISupplier[];
}

const SupplierReturnGrid = observer(({ data, suppliers }: IProp) => {
  const columns: GridColDef[] = [
    {
      field: "supplierId",
      headerName: "Customer (supplier)",
      width: 350,
      renderCell: (params) => {
        const supplier = suppliers.find(
          (supplier) => supplier.id === params.row.supplierId
        );
        return (
          <>{supplier ? "supplier " + supplier.name : "Unknown supplier"}</>
        );
      },
    },
    {
      field: "balance",
      headerName: "balance",
      width: 390,
      valueFormatter: (params) => `NAD ${params.value.toFixed(2)}`,
    },
    {
      field: "referecnce",
      headerName: "Customer Reference",
      width: 300,
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

export default SupplierReturnGrid;
