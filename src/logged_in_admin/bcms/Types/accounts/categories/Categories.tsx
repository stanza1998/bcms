import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import { IAccountCategory } from "../../../../../shared/models/Types/AccountCategories";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { SuccessfulAction } from "../../../../../shared/models/Snackbar";
import Modal from "../../../../../shared/components/Modal";
import Toolbar2 from "../../../../shared/Toolbar2";
import { IconButton } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

const Categories = observer(() => {
  const { store, api, ui } = useAppContext();
  const me = store.user.meJson;
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.CREATE_ACCOUNT_CATEGORY);
  };

  const createCategory = async () => {
    setLoading(true);
    const data: IAccountCategory = {
      id: "",
      name: name,
      description: description,
    };

    try {
      if (me?.property)
        await api.body.accountCategory.create(data, me.property);
      hideModalFromId(DIALOG_NAMES.BODY.CREATE_ACCOUNT_CATEGORY);
      getData();
      setName("");
      setDescription("");
      SuccessfulAction(ui);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const categories = store.bodyCorperate.accountCategory.all.map((c) => {
    return c.asJson;
  });

  useEffect(() => {
    const getData = async () => {
      if (me?.property) await api.body.accountCategory.getAll(me.property);
    };
    getData();
  }, []);

  const getData = async () => {
    if (me?.property) await api.body.accountCategory.getAll(me.property);
  };
  getData();

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">CATEGORIES</h4>
          <div className="controls">
            <div className="uk-inline">
              <button
                onClick={onCreate}
                className="uk-button primary"
                type="button"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
        {categories.map((c) => (
          <ul key={c.id} className="uk-list uk-list-striped">
            <li>{c.name}</li>
          </ul>
        ))}
      </div>

      <Modal modalId={DIALOG_NAMES.BODY.CREATE_ACCOUNT_CATEGORY}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical staff-dialog">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          <h4 className="uk-modal-title">Create account category</h4>
          <div className="uk-margin">
            <div className="uk-margin">
              <label>Category Name</label>
              <br />
              <input
                className="uk-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="uk-margin">
              <label>Category Description</label>
              <br />
              <input
                className="uk-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button className="uk-button primary" onClick={createCategory}>
              Save Category
            </button>
            {loading && <p>loading...</p>}
          </div>
        </div>
      </Modal>
    </div>
  );
});

export default Categories;
