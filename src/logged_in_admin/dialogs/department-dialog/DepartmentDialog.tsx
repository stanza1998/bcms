import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import IDepartment, { defaultDepartment, } from "../../../shared/interfaces/IDepartment";
import DIALOG_NAMES from "../Dialogs";

const DepartmentDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);


  const [department, setDepartment] = useState<IDepartment>({
    ...defaultDepartment,
  });


  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Update API
    try {
      if (store.department.selected) {
        const deptment = await api.department.update(department);
        if (deptment) await store.department.load([deptment]);
        ui.snackbar.load({
          id: Date.now(),
          message: "Department updated!",
          type: "success",
        });
      } else {
        await api.department.create(department);
        ui.snackbar.load({
          id: Date.now(),
          message: "Department created!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update department.",
        type: "danger",
      });
    }

    store.department.clearSelected();
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.TEAM.DEPARTMENT_DIALOG);
  };

  useEffect(() => {
    if (store.department.selected) setDepartment(store.department.selected);
    else setDepartment({ ...defaultDepartment });

    return () => { };
  }, [store.department.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Department</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Department
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  type="text"
                  placeholder="Department name"
                  value={department.name}
                  onChange={(e) =>
                    setDepartment({ ...department, name: e.target.value })
                  }
                  required
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
    </div>
  );
});

export default DepartmentDialog;
