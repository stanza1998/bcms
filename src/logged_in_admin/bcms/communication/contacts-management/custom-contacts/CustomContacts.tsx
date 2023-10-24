import React, { useEffect } from "react";
import Toolbar2 from "../../../../shared/Toolbar2";
import { IconButton } from "@mui/material";
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import Modal from "../../../../../shared/components/Modal";
import { CustomContactDialog } from "../../../../dialogs/communication-dialogs/custom-contacts/CustomContactsDialog";
import { observer } from "mobx-react-lite";
import { CustomerContactsGrid } from "./grid/CustomerContactsGrid";

export const CustomContacts = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const customs = store.communication.customContacts.all.map((c) => {
    return c.asJson;
  });

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_CUSTOM_CONTACT);
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property)
        await api.communication.customContact.getAll(me.property);
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Toolbar2
        rightControls={
          <IconButton onClick={onCreate}>
            <AddIcCallIcon />
          </IconButton>
        }
        leftControls={<></>}
      />
      <CustomerContactsGrid data={customs} />
      <Modal modalId={DIALOG_NAMES.COMMUNICATION.CREATE_CUSTOM_CONTACT}>
        <CustomContactDialog />
      </Modal>
    </div>
  );
});
