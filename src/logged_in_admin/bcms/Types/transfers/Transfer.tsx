import React, { useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import showModalFromId from "../../../../shared/functions/ModalShow";
import { Transfers } from "./Transfers";
import { TransferDialog } from "../../../dialogs/transfer-dialog/TransferDialog";
import { TransferTable } from "./TransferTable";

export const Transfer = observer(() => {
  const { store, api } = useAppContext();
  const [loading, setLoading] = useState(false);

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
  };
  useEffect(() => {
    const getData = async () => {
      await api.body.transfer.getAll();
    };
    getData();
  }, []);

  const transfers = store.bodyCorperate.transfer.all.map((acc) => {
    return acc.asJson;
  });

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Transfers</h4>
          <div className="controls">
            <div className="uk-inline">
              <button
                onClick={onCreate}
                className="uk-button primary"
                type="button"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
        <TransferTable data={transfers} />
      </div>
      <Modal modalId={DIALOG_NAMES.BODY.ALLOCATE_DIALOGS}>
        <TransferDialog />
      </Modal>
    </div>
  );
});
