import React, { useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import DIALOG_NAMES from "../../../dialogs/Dialogs";
import Modal from "../../../../shared/components/Modal";
import showModalFromId from "../../../../shared/functions/ModalShow";
import { Suppliers } from "./Suppliers";
import { SupplierDialog } from "../../../dialogs/supplier-dialog/SupplierDialog";
import { SupplierTable } from "./SupplierTables";

export const Supplier = observer(() => {
  const { store, api } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.ALLOCATE_DIALOGS);
  };

  useEffect(() => {
    const getData = async () => {
      if (!me?.property) return;
      await api.body.supplier.getAll(me?.property);
    };
    getData();
  }, []);

  const suppliers = store.bodyCorperate.supplier.all.map((acc) => {
    return acc.asJson;
  });

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Suppliers</h4>
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
        <SupplierTable data={suppliers} />
      </div>
      <Modal modalId={DIALOG_NAMES.BODY.ALLOCATE_DIALOGS}>
        <SupplierDialog />
      </Modal>
    </div>
  );
});
