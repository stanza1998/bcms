import React from "react";
import { IBankingTransactions } from "../../../../../shared/models/banks/banking/BankTransactions";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { IUnit } from "../../../../../shared/models/bcms/Units";
import { INormalAccount } from "../../../../../shared/models/Types/Account";
import { ISupplier } from "../../../../../shared/models/Types/Suppliers";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import { nadFormatter } from "../../../../shared/NADFormatter";

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
      headerName: "Customer/Supplier/N/A",
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
        return <>{account ? account.name : "Unknown"}</>;
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
      width: 150,
      renderCell: (params) => {
        const account = accounts.find((acc) => acc.id === params.row.selection);
        return <>{account ? account.name : "Unknown"}</>;
      },
    },
    {
      field: "reference",
      headerName: "Reference",
      width: 100,
    },
    {
      field: "VAT",
      headerName: "VAT",
      width: 50,
    },
    {
      field: "credit",
      headerName: "Outflows",
      width: 120,
      renderCell: (params) => <> {nadFormatter.format(params.row.credit)}</>,
    },
    {
      field: "debit",
      headerName: "Inflows",
      width: 120,
      renderCell: (params) => <> {nadFormatter.format(params.row.debit)}</>,
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
    <Box sx={{ height: 425 }} className="invoices-grid">
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
