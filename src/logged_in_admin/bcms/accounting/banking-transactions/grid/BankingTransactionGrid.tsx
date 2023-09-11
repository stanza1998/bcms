import React from "react";
import { IBankingTransactions } from "../../../../../shared/models/banks/banking/BankTransactions";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { IUnit } from "../../../../../shared/models/bcms/Units";
import { INormalAccount } from "../../../../../shared/models/Types/Account";
import { ISupplier } from "../../../../../shared/models/Types/Suppliers";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";

interface IProp {
  data: IBankingTransactions[];
  units: IUnit[];
  accounts: INormalAccount[];
  suppliers: ISupplier[];
}

const BankingTransactionGrid = ({
  data,
  units,
  accounts,
  suppliers,
}: IProp) => {
  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 90,
    },
    {
      field: "payee",
      headerName: "Customer",
      width: 120,
      renderCell: (params) => {
        const unit = units.find((unit) => unit.id === params.row.payee);
        const supplier = suppliers.find((supp) => supp.id === params.row.payee);
        const account = accounts.find((acc) => acc.id === params.row.payee);
        return (
          // <> {unit ? "Unit " + unit.unitName : supplier ? supplier.name : ""}</>
          <>
            {" "}
            {unit ? "Unit " + unit.unitName : supplier ? supplier.name : "N/A"}
          </>
        );
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 170,
      renderCell: (params) => {
        const account = accounts.find((acc) => acc.id === params.row.selection);
        return <>{account ? account.name : "Unknown Unit"}</>;
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 80,
    },
    {
      field: "selection",
      headerName: "Selection",
      width: 180,
      renderCell: (params) => {
        const account = accounts.find((acc) => acc.id === params.row.selection);
        return <>{account ? account.name : "Unknown Unit"}</>;
      },
    },
    {
      field: "reference",
      headerName: "Reference",
      width: 130,
    },
    {
      field: "VAT",
      headerName: "VAT",
      width: 70,
    },
    {
      field: "credit",
      headerName: "Credit",
      width: 80,
    },
    {
      field: "debit",
      headerName: "Debit",
      width: 80,
    },
    {
      field: "Action",
      headerName: "Actions",
      width: 60,
      renderCell: (params) => (
        <div>
          <IconButton uk-toolTip="view transaction">
            <ViewHeadlineIcon />
          </IconButton>
        </div>
      ),
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
};

export default BankingTransactionGrid;
