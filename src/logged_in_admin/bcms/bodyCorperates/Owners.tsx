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
import { USER_ROLES } from "../../../shared/constants/USER_ROLES";
import Select from "react-select";
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
        {/* <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>

          <h3 className="uk-modal-title">Owner</h3>
          <div className="dialog-content uk-position-relative">
            <div className="reponse-form">
              <form className="uk-form-stacked" onSubmit={onSave}>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="form-stacked-text">
                    Email
                  </label>
                  <div className="uk-form-controls">
                    <input
                      className="uk-input"
                      placeholder="example@example.com
                      "
                      value={employees.email}
                      onChange={(e) =>
                        setEmployee({
                          ...employees,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="uk-width-1-1@m">
                  <label className="uk-form-label" htmlFor="form-stacked-text">
                    Assign Property
                  </label>
                  <div className="uk-margin uk-form-controls">
                    <Select
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      onChange={(value: any) =>
                        setEmployee({
                          ...employees,
                          accessProperties: value.map((t: any) => t.value),
                        })
                      }
                      isMulti
                      placeholder="Properties"
                      options={properties}
                      value={employees.accessProperties?.map((p) => {
                        const selectedProperty = properties.find(
                          (property) => property.value === p
                        );
                        return selectedProperty
                          ? {
                              label: selectedProperty.label,
                              value: selectedProperty.value,
                            }
                          : null;
                      })}
                    />
                  </div>
                </div>
                <div className="footer uk-margin">
                  <button className="uk-button secondary uk-modal-close">
                    Cancel
                  </button>
                  <button className="uk-button primary" type="submit">
                    Save
                    {loading && <div data-uk-spinner="ratio: .5"></div>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div> */}
      </Modal>
    </>
  );
});

export default Owners;
