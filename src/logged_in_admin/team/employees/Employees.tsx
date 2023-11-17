import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import Loading from "../../../shared/components/Loading";
import Modal from "../../../shared/components/Modal";
import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import { UserModel } from "../../../shared/models/User";
import { IUser } from "../../../shared/interfaces/IUser";
import DIALOG_NAMES from "../../dialogs/Dialogs";
import UserDialog from "../../dialogs/user-dialog/UserDialog";

interface ToolBarProps {
  showUserDialog: (user?: IUser | undefined) => void;
}
const ToolBar = (props: ToolBarProps) => {
  const { showUserDialog } = props;
  return (
    <div className="section-toolbar uk-margin">
      <h4 className="section-heading uk-heading">Team</h4>
      <div className="controls">
        <button className="uk-button primary" onClick={() => showUserDialog()}>
          Add Employee
        </button>
      </div>
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
  const { store } = useAppContext();
  const { employees, isLoading, onEditEmployee, onDeleteEmployee } = props;
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    setIsEmpty(employees.length === 0);
    return () => {};
  }, [employees.length]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="">
      <div className="company-users uk-margin">
        {!isEmpty ? (
          <div className="uk-overflow-auto">
            <table style={{color:"black"}} className="company-users-table uk-table uk-table-small uk-table-divider uk-table-middle uk-table-responsive">
              <thead className="table-header">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th className="uk-table-expand">Department</th>
                  <th className="uk-table-expand">Role</th>
                  <th className="actions uk-text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {employees
                  .filter((emp) => emp.role !== "Owner")
                  .map((employee, index) => (
                    <tr className="row" key={employee.uid}>
                      <td className="id">{index + 1}</td>
                      <td className="customerName">{`${employee.firstName} ${employee.lastName}`}</td>
                      <td className="department">{employee.departmentName}</td>
                      <td className="role">{employee.role}</td>
                      <td className="actions uk-text-right">
                        <button
                          className="uk-margin-right uk-icon"
                          data-uk-icon="pencil"
                          onClick={() => onEditEmployee(employee.asJson)}
                        >
                          {/* Edit */}
                        </button>
                        <button
                          className="uk-margin-right uk-icon"
                          data-uk-icon="trash"
                          onClick={() => onDeleteEmployee(employee.uid)}
                        >
                          {/* Remove */}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-orders">
            <p className="uk-text-center">
              Empty (no employees) <span>😔</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Employees = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);

  const showUserDialog = (user?: IUser) => {
    if (user) store.user.select(user);
    else store.user.clearSelected();
    showModalFromId(DIALOG_NAMES.TEAM.USER_DIALOG);
  };

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
          <div className="uk-card uk-card-default uk-card-small uk-card-body">
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

      <Modal modalId={DIALOG_NAMES.TEAM.USER_DIALOG}>
        <UserDialog />
      </Modal>
    </>
  );
});

export default Employees;
