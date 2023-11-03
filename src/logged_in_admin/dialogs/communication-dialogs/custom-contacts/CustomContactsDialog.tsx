import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../Dialogs";
import {
  ICustomContact,
  defaultCustomContacts,
} from "../../../../shared/models/communication/contact-management/CustomContacts";

export const CustomContactDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;

  const [customContact, setCustomContact] = useState<ICustomContact>({
    ...defaultCustomContacts,
  });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API

    try {
      if (store.communication.customContacts.selected) {
        const deptment = await api.communication.customContact.update(
          customContact,
          me.property
        );
        await store.communication.customContacts.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "Custom Contact updated!",
          type: "success",
        });
      } else {
        await api.communication.customContact.create(
          customContact,
          me.property
        );
        ui.snackbar.load({
          id: Date.now(),
          message: "Custom Contact created!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update Custom Contact.",
        type: "danger",
      });
    }

    store.communication.customContacts.clearSelected();
    setCustomContact({ ...defaultCustomContacts });
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_CUSTOM_CONTACT);
  };

  useEffect(() => {
    if (store.communication.customContacts.selected)
      setCustomContact(store.communication.customContacts.selected);
    else setCustomContact({ ...defaultCustomContacts });

    return () => {};
  }, [store.communication.customContacts.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Custom Contact</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
              {customContact.name === '' && (
    <span style={{ color: "red" }}>*</span>
  )}
                Name
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Contact Name"
                  value={customContact.name}
                  onChange={(e) =>
                    setCustomContact({
                      ...customContact,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
              {customContact.email === '' && (
    <span style={{ color: "red" }}>*</span>
  )}
                Email
              </label>
         
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Email"
                  type="email"
                  value={customContact.email}
                  onChange={(e) =>
                    setCustomContact({
                      ...customContact,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                            {customContact.cellTell === '' && (
    <span style={{ color: "red" }}>*</span>
  )}
                Phone Number
              </label>
  
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Phone Number"
                  type="text"
                  value={customContact.cellTell}
                  onChange={(e) =>
                    setCustomContact({
                      ...customContact,
                      cellTell: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
              {customContact.cityTown === '' && (
    <span style={{ color: "red" }}>*</span>
  )}
                Town Or City 
           </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Town or City"
                  type="text"
                  value={customContact.cityTown}
                  onChange={(e) =>
                    setCustomContact({
                      ...customContact,
                      cityTown: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
              {customContact.location === '' && (
    <span style={{ color: "red" }}>*</span>
  )}
                Location
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Location"
                  type="text"
                  value={customContact.location}
                  onChange={(e) =>
                    setCustomContact({
                      ...customContact,
                      location: e.target.value,
                    })
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
