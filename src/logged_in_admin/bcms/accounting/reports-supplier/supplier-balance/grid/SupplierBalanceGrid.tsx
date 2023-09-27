import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { useEffect } from "react";
import { nadFormatter } from "../../../../../shared/NADFormatter";

export interface IAgingAnalysisSupplier {
  supplierId: string;
  current: number;
  days30: number;
  days60: number;
  days90: number;
  days120Plus: number;
}
interface IProp {
  data: IAgingAnalysisSupplier[];
}

const SupplierBalanceGrid = observer(({ data }: IProp) => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const suppliers = store.bodyCorperate.supplier.all;

  const columns: GridColDef[] = [
    {
      field: "supplierId",
      headerName: "Supplier",
      width: 170,
      renderCell: (params) => (
        <>
          {suppliers
            .filter((s) => s.asJson.id === params.row.supplierId)
            .map((s) => {
              return s.asJson.name;
            })}
        </>
      ),
    },
    {
      field: "days120Plus",
      headerName: "120+ Days",
      width: 150,
      renderCell: (params) => (
        <>{nadFormatter.format(params.row.days120Plus)}</>
      ),
    },
    {
      field: "days90",
      headerName: "90 Days",
      width: 150,
      renderCell: (params) => <>{nadFormatter.format(params.row.days90)}</>,
    },
    {
      field: "days60",
      headerName: "60 Days",
      width: 150,

      renderCell: (params) => <>{nadFormatter.format(params.row.days60)}</>,
    },
    {
      field: "days30",
      headerName: "30 Days",
      width: 150,

      renderCell: (params) => <>{nadFormatter.format(params.row.days30)}</>,
    },
    {
      field: "current",
      headerName: "Current",
      width: 150,
      renderCell: (params) => <>{nadFormatter.format(params.row.current)}</>,
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      width: 150,
      renderCell: (params) => (
        <>
          {nadFormatter.format(
            params.row.days120Plus +
              params.row.days90 +
              params.row.days60 +
              params.row.days30 +
              params.row.current
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    const getData = async () => {
      if (me?.property) await api.body.supplier.getAll(me.property);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ height: 350 }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.supplierId} // Use the appropriate identifier property
        rowHeight={40}
      />
    </Box>
  );
});

export default SupplierBalanceGrid;
