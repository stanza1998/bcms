import { FormEvent, useEffect, useState } from "react";
import {
  IServiceProvider,
  defaultServiceProvider,
} from "../../../../shared/models/maintenance/service-provider/ServiceProviderModel";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../Dialogs";
import { observer } from "mobx-react-lite";

export const UpdateServiceProviderDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [provider, setProvider] = useState<IServiceProvider>({
    ...defaultServiceProvider,
  });
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;

    try {
      if (store.maintenance.servie_provider.selected) {
        const providers = await api.maintenance.service_provider.update(
          provider,
          me.property
        );
        await store.maintenance.servie_provider.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "Service Provider updated!",
          type: "success",
        });
      } else {
        await api.maintenance.service_provider.create(provider, me.property);
        ui.snackbar.load({
          id: Date.now(),
          message: "ServiceProvider created!",
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

    store.maintenance.servie_provider.clearSelected();
    setProvider({ ...defaultServiceProvider });
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.MAINTENANCE.UPDATE_SERVICE_PROVIDER);
  };

  useEffect(() => {
    if (store.maintenance.servie_provider.selected) {
      setProvider(store.maintenance.servie_provider.selected);
    } else {
      setProvider({ ...defaultServiceProvider });
      return () => {};
    }
  }, [store.maintenance.servie_provider.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Service Provider</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Service Provider Name
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Service Provider Name"
                  value={provider.serviceProvideName}
                  onChange={(e) =>
                    setProvider({
                      ...provider,
                      serviceProvideName: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Email
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Email"
                  type="email"
                  value={provider.email}
                  onChange={(e) =>
                    setProvider({
                      ...provider,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Phone Number
              </label>

              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Phone Number"
                  type="text"
                  value={provider.phoneNumber}
                  onChange={(e) =>
                    setProvider({
                      ...provider,
                      phoneNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Date Created
            
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Date Created"
                  type="text"
                  value={provider.dateCreated}
                  onChange={(e) =>
                    setProvider({
                      ...provider,
                      dateCreated: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Specialisation
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Specialisation"
                  type="text"
                  value={provider.specializationi}
                  onChange={(e) =>
                    setProvider({
                      ...provider,
                      specializationi: e.target.value,
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
