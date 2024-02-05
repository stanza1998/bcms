import { observer } from "mobx-react-lite";
import { FormEvent, useCallback, useEffect, useState } from "react";
import Loading from "../../../shared/components/Loading";
import Modal from "../../../shared/components/Modal";
import { useAppContext } from "../../../shared/functions/Context";
import { UserModel } from "../../../shared/models/User";
import { IUser, defaultUser } from "../../../shared/interfaces/IUser";
import DIALOG_NAMES from "../../dialogs/Dialogs";
import OwnersTable from "./OwnersGrid";
import showModalFromId, {
  hideModalFromId,
} from "../../../shared/functions/ModalShow";
import OwnerDialog from "../../dialogs/user-dialog/OwnerDialog";
import makeAnimated from "react-select/animated";

interface ToolBarProps {
  showUserDialog: (user?: IUser | undefined) => void;
}

const ToolBar = (props: ToolBarProps) => {
  const onAdd = () => {
    showModalFromId(DIALOG_NAMES.OWNER.ADD_OWNER_DIALOG);
  };
  return (
    <div className="section-toolbar uk-margin">
      <h4 className="section-heading uk-heading">OWNERS</h4>
      <div className="controls">
        <button className="uk-button primary" onClick={onAdd}>
          Add Owner
        </button>
      </div>
      <Modal modalId={DIALOG_NAMES.OWNER.ADD_OWNER_DIALOG}>
        <OwnerDialog />
      </Modal>
    </div>
  );
};

interface EmployeesTableProps {
  employees: UserModel[];
  isLoading: boolean;
  onEditEmployee: (user: IUser) => void;
  onDeleteEmployee: (uid: string) => void;
}
const EmployeesTable = (props: EmployeesTableProps) => {
  const { store, api } = useAppContext();

  const { employees, isLoading } = props;
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    setIsEmpty(employees.length === 0);
    return () => {};
  }, [employees.length]);

  if (isLoading) {
    return <Loading />;
  }

  const employeesList = employees
    .filter((emp) => emp.role === "Owner")
    .map((emp) => {
      return emp.asJson;
    });
  return (
    <div className="">
      <div className="company-users uk-margin">
        {!isEmpty ? (
          <div className="uk-overflow-auto">
            <OwnersTable
              data={employeesList.map((emp) => {
                return emp;
              })}
            />
          </div>
        ) : (
          <div className="no-orders">
            <p className="uk-text-center">
              Empty (no owners) <span>😔</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Owners = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployee] = useState<IUser>({
    ...defaultUser,
  });
  const me = store.user.meJson;
  const animatedComponents = makeAnimated();

  const showUserDialog = (user?: IUser) => {
    if (user) {
      store.user.select(user);
      showModalFromId(DIALOG_NAMES.OWNER.UPDATE_OWNER_DIALOG);
    } else store.user.clearSelected();
  };

  const properties = store.bodyCorperate.bodyCop.all.map((property) => {
    return { label: property.asJson.BodyCopName, value: property.asJson.id };
  });

  console.log("properties: ", properties);

  const onDeleteEmployee = async (uid: string) => {
    if (!window.confirm("Delete user?")) return;
    await api.auth.deleteUserFromDB(uid);
    store.user.remove(uid);
    ui.snackbar.load({
      id: Date.now(),
      message: "User deleted!",
      type: "success",
    });
  };

  // const onEditEmployee = async (user:IUser) => {
  //   await api.auth.updateUser(user);
  //   store.user.getById(user.uid);
  //   ui.snackbar.load({
  //     id: Date.now(),
  //     message: "User Updated!",
  //     type: "success",
  //   });
  // };

  // Load data.
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    await api.auth.loadAll();
    await api.department.getAll();
    setLoading(false);
  }, [api.auth, api.department]);

  useEffect(() => {
    loadEmployees();
    return () => {};
  }, [loadEmployees]);

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Update API
    if (store.user.selected) {
      const emp = await api.auth.updateUser(employees);
      //await api.auth.createUser(employees); //create for now
      hideModalFromId(DIALOG_NAMES.OWNER.UPDATE_OWNER_DIALOG);

      store.user.getById(employees.uid);
      ui.snackbar.load({
        id: Date.now(),
        message: "Owner Updated!",
        type: "success",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (store.user.selected) setEmployee(store.user.selected);
    else setEmployee({ ...defaultUser });

    return () => {};
  }, [store.user.selected]);

  useEffect(() => {
    const getData = async () => {
      if (me?.property) {
        await api.unit.getAll(me?.property);
      }
      await api.body.body.getAll();
    };
    getData();
  }, [api.body]);

  return (
    <>
      <div className="uk-section sales-order">
        <div className="uk-container uk-container-large">
          <ToolBar showUserDialog={showUserDialog} />
          {loading && (
            <div className="uk-card-default uk-card-body">
              <Loading />
            </div>
          )}
          <div>
            {!loading && (
              <EmployeesTable
                employees={store.user.all}
                isLoading={loading}
                onEditEmployee={showUserDialog}
                onDeleteEmployee={onDeleteEmployee}
              />
            )}
          </div>
        </div>
      </div>
      <Modal modalId={DIALOG_NAMES.OWNER.UPDATE_OWNER_DIALOG}>
        <OwnerDialog />
      </Modal>
    </>
  );
});

export default Owners;
