import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { IUnit } from "../../../../../../shared/models/bcms/Units";
import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { nadFormatter } from "../../../../../shared/NADFormatter";
import { useNavigate } from "react-router-dom";
import { UnitCard } from "../unit-details/UnitCard";

interface IProp {
  data: IUnit[];
}

const UnitsGrid = observer(({ data }: IProp) => {
  const { store, api } = useAppContext();
  const owners = store.user.all.filter((o) => o.role === "Owner");
  const me = store.user.meJson;
  const navigate = useNavigate();


  useEffect(() => {
    const getUsers = async () => {
      await api.auth.loadAll();
    };
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unitInfo = (id: string) => {
    if (me?.property) {
      navigate(`/c/body/body-corperate/${me?.property}/${id}`);
    } else {
      alert("[Propety Id not found");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "unitName",
      headerName: "Units",
      flex: 1,
      // width: 200,
      renderCell: (params) => (
        <span style={{ textTransform: "uppercase" }}>
          Unit {params.row.unitName}
        </span>
      ),
    },
    {
      field: "firstName",
      headerName: "Owner Name",
      flex: 1,
      // width: 200,
      renderCell: (params) => (
        <span style={{ textTransform: "uppercase" }}>
          {owners
            .filter((owner) => owner.uid === params.row.ownerId)
            .map((owner) => {
              return owner.asJson.firstName + " " + owner.asJson.lastName;
            })}
        </span>
      ),
    },
    {
      field: "email",
      headerName: "Owner Email",
      flex: 1,
      // width: 200,
      renderCell: (params) => (
        <>
          {owners
            .filter((owner) => owner.uid === params.row.ownerId)
            .map((owner) => {
              return owner.email;
            })}
        </>
      ),
    },
    {
      field: "cellphone",
      headerName: "Owner Phone",
      flex: 1,
      // width: 200,
      renderCell: (params) => (
        <>
          {owners
            .filter((owner) => owner.uid === params.row.ownerId)
            .map((owner) => {
              return "0" + owner.cellphone;
            })}
        </>
      ),
    },
    // {
    //   field: "balance",
    //   headerName: "Balance",
    //   flex: 1,
    //   // width: 214,
    //   renderCell: (params) => {
    //     if (parseFloat(params.row.balance) < 0) {
    //       return (
    //         <span
    //           style={{
    //             background: "red",
    //             color: "white",
    //             padding: "10px",
    //             flex: 1,
    //           }}
    //         >
    //           {nadFormatter.format(params.row.balance)}
    //         </span>
    //       );
    //     } else {
    //       return (
    //         <span
    //           style={{
    //             background: "green",
    //             color: "white",
    //             padding: "10px",
    //             flex: 1,
    //           }}
    //         >
    //           {nadFormatter.format(params.row.balance)}
    //         </span>
    //       );
    //     }
    //   },
    // },
    {
      field: "Action",
      headerName: "Action",
      renderCell: (params) => (
        <div>
          <UnitCard key={params.row.id} unit={params.row} />
          {/* <button
            className="uk-margin-right uk-icon"
            data-uk-icon="thumbnails"
            onClick={() => unitInfo(params.row.id)}
          ></button> */}
        </div>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", height: 450, p: 2 }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id}
        rowHeight={40}
      />
    </Box>
  );
});
export default UnitsGrid;
// width:'100%',height: '100vh'
