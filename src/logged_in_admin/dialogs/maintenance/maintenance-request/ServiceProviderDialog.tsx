import { observer } from "mobx-react-lite";
import { useState, FormEvent, useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../Dialogs";
import {
  IServiceProvider,
  defaultServiceProvider,
} from "../../../../shared/models/maintenance/service-provider/ServiceProviderModel";
import { IUser } from "../../../../shared/interfaces/IUser";
import { generateUniqueCode } from "../../../shared/common";

export const ServiceProviderDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;

  const [serviceProviderRequest, setServiceProviderRequest] =
    useState<IServiceProvider>({
      ...defaultServiceProvider,
    });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (store.maintenance.servie_provider.selected) {
        await api.maintenance.service_provider.update(
          serviceProviderRequest,
          me?.property || ""
        );
        ui.snackbar.load({
          id: Date.now(),
          message: "Service Provider Updated!",
          type: "success",
        });
      } else {
        serviceProviderRequest.code = generateUniqueCode();
        // serviceProviderRequest.dateCreated = ;

        await api.maintenance.service_provider.create(
          serviceProviderRequest,
          me?.property || ""
        );

        
        ui.snackbar.load({
          id: Date.now(),
          message: "Service Provider Created!",
          type: "success",
        });
      }
    } catch (error) {
      alert(error);
    }

    store.maintenance.servie_provider.clearSelected();
    setServiceProviderRequest({ ...defaultServiceProvider });
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_SERVICE_PROVIDER);
  };

  useEffect(() => {
    if (store.maintenance.servie_provider.selected)
      setServiceProviderRequest(store.maintenance.servie_provider.selected);
    else setServiceProviderRequest({ ...defaultServiceProvider });

    return () => {};
  }, [store.maintenance.servie_provider.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <h3 className="uk-modal-title">Create Service Provider</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Service Provider
                {serviceProviderRequest.serviceProvideName === "" && (
                  <span style={{ color: "red", marginLeft: "10px" }}>*</span>
                )}
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Provider Name"
                  value={serviceProviderRequest.serviceProvideName}
                  onChange={(e) =>
                    setServiceProviderRequest({
                      ...serviceProviderRequest,
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
                {serviceProviderRequest.email === "" && (
                  <span style={{ color: "red", marginLeft: "10px" }}>*</span>
                )}
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  placeholder="Email"
                  value={serviceProviderRequest.email}
                  onChange={(e) =>
                    setServiceProviderRequest({
                      ...serviceProviderRequest,
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
                {serviceProviderRequest.phoneNumber === "" && (
                  <span style={{ color: "red", marginLeft: "10px" }}>*</span>
                )}
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Phone Number"
                  type="text"
                  value={serviceProviderRequest.phoneNumber}
                  onChange={(e) =>
                    setServiceProviderRequest({
                      ...serviceProviderRequest,
                      phoneNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Specialisation
                {serviceProviderRequest.specializationi === "" && (
                  <span style={{ color: "red", marginLeft: "10px" }}>*</span>
                )}
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  placeholder="Specialisation"
                  type="text"
                  value={serviceProviderRequest.specializationi}
                  onChange={(e) =>
                    setServiceProviderRequest({
                      ...serviceProviderRequest,
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
