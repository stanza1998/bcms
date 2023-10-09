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
      flex:1,
    },
    {
      field: "payee",
      headerName: "Customer/Supplier/N/A",
      flex:1,
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
      flex:1,
      renderCell: (params) => {
        const account = accounts.find((acc) => acc.id === params.row.selection);
        return <>{account ? account.name : "Unknown"}</>;
      },
    },
    {
      field: "type",
      headerName: "Type",
      flex:1,
    },
    {
      field: "selection",
      headerName: "Selection",
      flex:1,
      renderCell: (params) => {
        const account = accounts.find((acc) => acc.id === params.row.selection);
        return <>{account ? account.name : "Unknown"}</>;
      },
    },
    {
      field: "reference",
      headerName: "Reference",
      flex:1,
    },
    {
      field: "VAT",
      headerName: "VAT",
      flex:1,
    },
    {
      field: "credit",
      headerName: "Outflows",
      flex:1,
      renderCell: (params) => <> {nadFormatter.format(params.row.credit)}</>,
    },
    {
      field: "debit",
      headerName: "Inflows",
      flex:1,
      renderCell: (params) => <> {nadFormatter.format(params.row.debit)}</>,
    },
    {
      field: "Action",
      headerName: "Actions",
      flex:1,
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
