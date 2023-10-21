import React from "react";
import { IBodyCop } from "../../../../shared/models/bcms/BodyCorperate";
import { observer } from "mobx-react-lite";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CorporateCard } from "./CorporateCard";
import { Box } from "@mui/material";
import { useAppContext } from "../../../../shared/functions/Context";
import FlightIcon from "@mui/icons-material/Flight";
import AirplanemodeInactiveIcon from "@mui/icons-material/AirplanemodeInactive";

interface IProp {
  data: IBodyCop[];
}

const CustomerGrid = observer(({ data }: IProp) => {
  const { store } = useAppContext();
  const me = store.user.meJson;

  const columns: GridColDef[] = [
    {
      field: "Active",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <div>
          {params.row.id === me?.property ? (
            <FlightIcon style={{ color: "#01aced" }} />
          ) : (
            <AirplanemodeInactiveIcon style={{ color: "grey" }} />
          )}
        </div>
      ),
    },
    { field: "BodyCopName", headerName: "Name", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "bankName", headerName: "Bank Name", flex: 1 },
    { field: "branchName", headerName: "Branch Name", flex: 1 },
    { field: "branchCode", headerName: "Branch Code", flex: 1 },
    {
      field: "Action",
      headerName: "Action",
      width: 0,
      renderCell: (params) => (
        <div>
          {params.row.id === me?.property && (
            <CorporateCard key={params.id} body={params.row} />
          )}
        </div>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500 }} className="invoices-grid">
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id} // Use the appropriate identifier property
        rowHeight={50}
      />
    </Box>
  );
});

export default CustomerGrid;
