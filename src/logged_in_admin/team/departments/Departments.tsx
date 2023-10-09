import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import Loading from "../../../shared/components/Loading";
import Modal from "../../../shared/components/Modal";
import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import { Department } from "../../../shared/models/Department";
import IDepartment from "../../../shared/interfaces/IDepartment";
import DepartmentDialog from "../../dialogs/department-dialog/DepartmentDialog";
import DIALOG_NAMES from "../../dialogs/Dialogs";

interface ToolBarProps {
  showDepartmentDialog: (deparmtent?: Department) => void;
}
const ToolBar = (props: ToolBarProps) => {
  const { showDepartmentDialog } = props;
  return (
    <div className="section-toolbar uk-margin">
      <h4 className="section-heading uk-heading">Team</h4>

      <div className="controls">
        <button
          className="uk-button primary"
          onClick={() => showDepartmentDialog()}
        >
          Add Department
        </button>
      </div>
    </div>
  );
};

interface DepartmentsTableProps {
  departments: Department[];
  isLoading: boolean;
  onEditDepartment: (department: IDepartment) => void;
  onDeleteDepartment: (id: string) => void;
}
const DepartmentsTable = (props: DepartmentsTableProps) => {
  const { departments, isLoading, onEditDepartment, onDeleteDepartment } =
    props;
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    setIsEmpty(departments.length === 0);
    return () => {};
  }, [departments.length]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="company-users uk-margin">
        {!isEmpty ? (
          <div className="uk-overflow-auto">
            <table className="company-users-table uk-table uk-table-small uk-table-divider uk-table-middle uk-table-responsive">
              <thead className="table-header">
                <tr>
                  <th>#</th>
                  <th>Department</th>
                  <th className="actions uk-text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {departments.map((department, index) => (
                  <tr className="row" key={department.id}>
                    <td className="id">{index + 1}</td>
                    <td className="departmentName">{department.name} </td>
                    <td className="actions uk-text-right">
                      <button
                        className="uk-margin-right uk-icon"
                        data-uk-icon="pencil"
                        onClick={() => onEditDepartment(department.asJson)}
                      >
                        {/* Edit */}
                      </button>
                      <button
                        className="uk-margin-right uk-icon"
                        data-uk-icon="trash"
                        onClick={() => onDeleteDepartment(department.id)}
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
              Empty (no company) <span>😔</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Departments = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);

  const showDepartmentDialog = (department?: IDepartment) => {
    if (department) store.department.select(department);
    else store.department.clearSelected();
    showModalFromId(DIALOG_NAMES.TEAM.DEPARTMENT_DIALOG);
  };

  const onDeleteDepartment = async (id: string) => {
    if (!window.confirm("Delete deparmtent?")) return;
    try {
      await api.department.delete(id);
      await store.department.remove(id);
      ui.snackbar.load({
        id: Date.now(),
        message: "Department deleted!",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Confirm that no user is assigned to department.",
        type: "warning",
        timeoutInMs: 10000,
      });
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Deleting department!",
        type: "danger",
      });
    }
  };

  // Load departments.
  const load = useCallback(async () => {
    setLoading(true);
    await api.department.getAll();
    setLoading(false);
  }, [api.department]);

  useEffect(() => {
    load();
    return () => {};
  }, [load]);

  return (
    <>
      <div className="uk-section sales-order">
        <div className="uk-container uk-container-large">
          <ToolBar showDepartmentDialog={showDepartmentDialog} />
          <div className="uk-card uk-card-default uk-card-small uk-card-body">
            <DepartmentsTable
              departments={store.department.all}
              isLoading={loading}
              onEditDepartment={showDepartmentDialog}
              onDeleteDepartment={onDeleteDepartment}
            />
          </div>
        </div>
      </div>

      <Modal modalId={DIALOG_NAMES.TEAM.DEPARTMENT_DIALOG}>
        <DepartmentDialog />
      </Modal>
    </>
  );
});

export default Departments;
