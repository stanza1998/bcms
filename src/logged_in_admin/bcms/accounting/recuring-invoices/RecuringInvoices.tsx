import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import { RecuringInvoicesDialog } from "../../../dialogs/recuring-invoices-dialog/RecuringInvoicesDialog";
import 'react-big-calendar/lib/css/react-big-calendar.css';

export const RecurringInvoices = observer(() => {
  const { store, api, ui } = useAppContext();

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.RECURING_INVOICE);
  };

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Recuring Invoices</h4>
          <div className="controls">
            <div className="uk-inline">
              <button
                className="uk-button primary"
                type="button"
                onClick={onCreate}
              >
                Create Recuring Invoice
              </button>
            </div>
          </div>
        </div>

      </div>
      <Modal modalId={DIALOG_NAMES.BODY.RECURING_INVOICE}>
        <RecuringInvoicesDialog />
      </Modal>
    </div>
  );
});
