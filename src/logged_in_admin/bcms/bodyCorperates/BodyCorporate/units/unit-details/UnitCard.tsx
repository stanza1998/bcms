import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { IUnit } from "../../../../../../shared/models/bcms/Units";
import showModalFromId from "../../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../../dialogs/Dialogs";

interface IProps {
  unit: IUnit;
}

export const UnitCard = observer((props: IProps) => {
  const { unit } = props;
  const { store } = useAppContext();

  const onView = () => {
    store.bodyCorperate.unit.select(unit);
    showModalFromId(DIALOG_NAMES.BODY.BODY_UNIT_DIALOG);
  };

  return (
    <span
      onClick={onView}
      className="uk-margin-right"
      data-uk-icon="pencil"
      style={{ cursor: "pointer" }}
    ></span>
  );
});
