import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../Dialogs";
import {
  IBodyCop,
  defaultBodyCop,
} from "../../../shared/models/bcms/BodyCorperate";

export const PropertyDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [body, setBodyCop] = useState<IBodyCop>({
    ...defaultBodyCop,
  });

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Update API
    try {
      if (store.bodyCorperate.bodyCop.selected) {
        const deptment = await api.body.body.update(body);
        if (deptment) await store.bodyCorperate.bodyCop.load([deptment]);
        ui.snackbar.load({
          id: Date.now(),
          message: "Property updated!",
          type: "success",
        });
      } else {
        await api.body.body.create(body);
        ui.snackbar.load({
          id: Date.now(),
          message: "body created!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update body.",
        type: "danger",
      });
    }

    store.bodyCorperate.bodyCop.clearSelected();
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.BODY.BODY_CORPORATE_DIALOG);
  };

  const onClear = () => {
    store.bodyCorperate.bodyCop.clearSelected();
    setBodyCop({ ...defaultBodyCop });
  };

  useEffect(() => {
    if (store.bodyCorperate.bodyCop.selected)
      setBodyCop(store.bodyCorperate.bodyCop.selected);
    else setBodyCop({ ...defaultBodyCop });

    return () => {};
  }, [store.bodyCorperate.bodyCop.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-modal-dialog-large@m">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={onClear}
      ></button>

      <h3 className="uk-modal-title">Property</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form" onSubmit={onSave}>
            <div className="uk-grid-small" data-uk-grid>
              <div className="uk-width-1-2@s ">
                <label className="uk-form-label" htmlFor="property-name">
                  Property Name
                  {body.BodyCopName === "" && (
                  <span style={{ color: "red" }}>*</span>
                )}
                </label>
                <div className="uk-form-controls">
                  <input
                    id="property-name"
                    className="uk-input"
                    type="text"
                    placeholder="Body name"
                    value={body.BodyCopName}
                    onChange={(e) =>
                      setBodyCop({ ...body, BodyCopName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="uk-width-1-2@s ">
                <label className="uk-form-label" htmlFor="property-location">
                  Property Location
                  {body.location === "" && (
                  <span style={{ color: "red" }}>*</span>
                )}
                </label>
                <div className="uk-form-controls">
                  <input
                    id="property-location"
                    className="uk-input"
                    type="text"
                    placeholder="Location"
                    value={body.location}
                    onChange={(e) =>
                      setBodyCop({ ...body, location: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="uk-width-1-2@s ">
                <label className="uk-form-label" htmlFor="bank-name">
                  Bank Name
                  {body.bankName === "" && (
                  <span style={{ color: "red" }}>*</span>
                )}
                </label>
                <div className="uk-form-controls">
                  <select
                    className="uk-input uk-select"
                    value={body.bankName}
                    onChange={(e) =>
                      setBodyCop({
                        ...body,
                        bankName: e.target.value,
                      })
                    }
                    required
                  >
                    <option value={""}>--Select--</option>
                    <option value="First National Bank">
                      First National Bank
                    </option>
                    <option value="Standard Bank">Standard Bank</option>
                    <option value="Bank Windhoek">Bank Windhoek</option>
                    <option value="Nedbank">Nedbank</option>
                  </select>
                </div>
              </div>

              <div className="uk-width-1-2@s ">
                <label className="uk-form-label" htmlFor="account-name">
                  Account Name
                  {body.accountName === "" && (
                  <span style={{ color: "red" }}>*</span>
                )}
                </label>
                <div className="uk-form-controls">
                  <input
                    id="account-name"
                    className="uk-input"
                    type="text"
                    placeholder="Account Name"
                    value={body.accountName}
                    onChange={(e) =>
                      setBodyCop({ ...body, accountName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="uk-width-1-2@s ">
                <label className="uk-form-label" htmlFor="account-number">
                  Account Number
                  {body.accountNumber === "" && (
                  <span style={{ color: "red" }}>*</span>
                )}
                </label>
                <div className="uk-form-controls">
                  <input
                    id="account-number"
                    className="uk-input"
                    type="text"
                    placeholder="Account Number"
                    value={body.accountNumber}
                    onChange={(e) =>
                      setBodyCop({ ...body, accountNumber: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="uk-width-1-2@s ">
                <label className="uk-form-label" htmlFor="account-style">
                  Account Style
                  {body.accountStyle === "" && (
                  <span style={{ color: "red" }}>*</span>
                )}
                </label>
                <div className="uk-form-controls">
                  <select
                    className="uk-input uk-select"
                    value={body.accountStyle}
                    onChange={(e) =>
                      setBodyCop({
                        ...body,
                        accountStyle: e.target.value,
                      })
                    }
                    required
                  >
                    <option value={""}>--Select--</option>
                    <option value={"Cheque"}>Cheque</option>
                    <option value={"Savings"}>Savings</option>
                  </select>
                </div>
              </div>
              <div className="uk-width-1-2@s ">
                <label className="uk-form-label" htmlFor="branch-name">
                  Branch Name     {body.branchName === "" && (
                  <span style={{ color: "red" }}>*</span>
                )}
                </label>
                <div className="uk-form-controls">
                  <input
                    id="branch-name"
                    className="uk-input"
                    type="text"
                    placeholder="Branch Name"
                    value={body.branchName}
                    onChange={(e) =>
                      setBodyCop({ ...body, branchName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="uk-width-1-2@s ">
                <label className="uk-form-label" htmlFor="branch-code">
                  Branch Code
                  {body.branchCode === "" && (
                  <span style={{ color: "red" }}>*</span>
                )}
                </label>
                <div className="uk-form-controls">
                  <input
                    id="branch-code"
                    className="uk-input"
                    type="text"
                    placeholder="Branch Code"
                    value={body.branchCode}
                    onChange={(e) =>
                      setBodyCop({ ...body, branchCode: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="uk-width-1-2@s ">
                <label className="uk-form-label" htmlFor="swift">
                  SWIFT
                </label>
                <div className="uk-form-controls">
                  <input
                    id="swift"
                    className="uk-input"
                    type="text"
                    placeholder="SWIFT"
                    value={body.swift}
                    onChange={(e) =>
                      setBodyCop({ ...body, swift: e.target.value })
                    }
                  />
                </div>
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

//  <div className="uk-form-controls">
//                   <input  id="bank-name"
//                     className="uk-input"
//                     type="text"
//                     placeholder="Bank Name"
//                     value={body.bankName}
//                     onChange={(e) =>
//                       setBodyCop({ ...body, bankName: e.target.value })
//                     }>
//                     <select className="uk-select">
//                       <option>First National Bank</option>
//                       <option>Bank Windhoek</option>
//                       <option>NedBank</option>
//                       <option>Standard Bank</option>
//                     </select>
//                   </input>
//                 </div>
