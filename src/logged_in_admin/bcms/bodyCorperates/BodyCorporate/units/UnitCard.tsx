import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { IUnit } from "../../../../../shared/models/bcms/Units";
import showModalFromId, {
  confirmationDialog,
} from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { useNavigate } from "react-router-dom";

interface IProps {
  unit: IUnit;
}

export const UnitCard = observer((props: IProps) => {
  const { unit } = props;
  const { store, api, ui } = useAppContext();
  const navigate = useNavigate();

  const onDelete = async (id: string) => {
    confirmationDialog().then(
      async function () {
        await api.unit.delete(id);
        ui.snackbar.load({
          id: Date.now(),
          message: "Deleted",
          type: "success",
        });
      },
      function () {}
    );
  };

  const onView = () => {
    store.bodyCorperate.unit.select(unit);
    showModalFromId(DIALOG_NAMES.BODY.BODY_UNIT_DIALOG);
  };

  // const unitInfo = (id: string) => {
  //   navigate(`/c/body/body-corperate/${propertyId}/${id}`);
  // };

  return (
    <>
      <span
        onClick={onView}
        className="uk-margin-right"
        data-uk-icon="pencil"
        style={{ cursor: "pointer" }}
      ></span>

      {/* <span
        onClick={() => onDelete(unit.id)}
        className="uk-margin-right"
        style={{ cursor: "pointer" }}
        data-uk-icon="trash"
      ></span> */}
    </>
  );
});
