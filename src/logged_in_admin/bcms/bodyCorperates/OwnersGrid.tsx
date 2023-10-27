import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { UserModel } from "../../../shared/models/User";
import { useAppContext } from "../../../shared/functions/Context";
import { useEffect } from "react";
import { IUser } from "../../../shared/interfaces/IUser";
import showModalFromId from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../dialogs/Dialogs";


interface IProp {
    data: IUser[];
  }

//      const onDelete = (user: UserModel) => {
//     store.user.select(user);
//     showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_ANNOUNCEMENTS_DIALOG);
//   };

const OwnersTable = observer(({  data }: IProp) => {

    const {store,api,ui} = useAppContext();

    const onUpdate = (user: IUser) => {
        store.user.select(user);
        showModalFromId(DIALOG_NAMES.OWNER.UPDATE_OWNER_DIALOG);
      };

      const onDeleteOwner = (user: IUser) => {
        store.user.select(user);
        showModalFromId(DIALOG_NAMES.OWNER.UPDATE_OWNER_DIALOG);
      };

      const onDelete = async (uid: string) => {
        if (!window.confirm("Delete user?")) return;
        await api.auth.deleteUserFromDB(uid);
        store.user.remove(uid);
        ui.snackbar.load({
          id: Date.now(),
          message: "User deleted!",
          type: "success",
        });
      };
        const columns: GridColDef[] = [
            // { field: "uid", headerName: "#", flex:1,},
            { field: "firstName",
            headerName: "User",
            flex:1,
            renderCell:(params)=>( <>
             {data.filter((owner)=>owner.uid === params.row.uid).map((owner)=>{
                    return owner.firstName +" "+ owner.lastName;})
             }
            </>
        )
        },
            { field: "email", headerName: "Email", flex:1,renderCell:(params)=>(
                <>
             {data.filter((owner)=>owner.uid === params.row.uid).map((owner)=>{
                    return owner.email})}
            </>
            ) },
            { field: "cellphone", headerName: "Cellphone", flex:1, renderCell:(params)=>(
                <>
                {data.filter((owner)=>owner.uid === params.row.uid).map((owner)=>{
                    return owner.cellphone})}
                </>
            ) },
            { field: "Actions", headerName: "Actions", flex:1, renderCell: (params) => (
                <div>
                <button className="uk-margin-right uk-icon" data-uk-icon="pencil" onClick={()=>onUpdate(params.row)}></button>
                <button  className="uk-margin-right uk-icon" data-uk-icon="trash" onClick={()=>onDelete(params.row)}></button>
              </div>
              ), },
          ];
          return (
            <>
              <Box sx={{ height: 500, boxShadow: 2,'& .MuiDataGrid-cell:hover': {color: 'primary.main',}, }}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  getRowId={(row) => row.uid} 
                  rowHeight={40}
                />
              </Box>
        </>   
  );});
  export default OwnersTable;
