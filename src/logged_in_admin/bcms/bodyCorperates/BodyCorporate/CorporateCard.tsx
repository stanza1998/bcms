import { observer } from "mobx-react-lite";
import { IBodyCop } from "../../../../shared/models/bcms/BodyCorperate";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId, {
  confirmationDialog,
} from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import { useNavigate } from "react-router-dom";

import GridViewIcon from "@mui/icons-material/GridView";

interface IProps {
  body: IBodyCop;
}

export const CorporateCard = observer((props: IProps) => {
  const { body } = props;
  const { store, api, ui } = useAppContext();
  const navigate = useNavigate();

  const onDelete = async (id: string) => {
    confirmationDialog().then(
      async function () {
        await api.body.body.delete(id);
        ui.snackbar.load({
          id: Date.now(),
          message: "Deleted",
          type: "success",
        });
      },
      function () {}
    );
  };

  const viewUnit = (propertyId: string) => {
    navigate(`/c/body/body-corperate/${propertyId}`);
  };

  const onView = () => {
    store.bodyCorperate.bodyCop.select(body);
    showModalFromId(DIALOG_NAMES.BODY.BODY_CORPORATE_DIALOG);
  };

  return (
    <>
      <span
        onClick={onView}
        className="uk-margin-right"
        data-uk-icon="pencil"
        style={{ cursor: "pointer" }}
      ></span>
      <span
        onClick={() => viewUnit(body.id)}
        className="uk-margin-right"
        style={{ cursor: "pointer" }}
        data-uk-icon=""
      >
        <GridViewIcon />
      </span>
    </>
  );
});
