import React, { useEffect, useState } from "react";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { IconButton } from "@mui/material";
import Toolbar2 from "../../../../shared/Toolbar2";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { ISupplierReturns } from "../../../../../shared/models/credit-notes-returns/SupplierReturns";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { SuccessfulAction } from "../../../../../shared/models/Snackbar";
import SupplierReturnGrid from "./grid/SupplierReturnsGrid";
import SaveIcon from "@mui/icons-material/Save";
import Modal from "../../../../../shared/components/Modal";
import { IBankingTransactions } from "../../../../../shared/models/banks/banking/BankTransactions";

export const SupplierReturns = observer(() => {
  const { store, api, ui } = useAppContext();
  const me = store.user.meJson;
  const [supplierId, setSupplierId] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [reference, setReference] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selection, setSelection] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const createSupplierReturn = async (e: any) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (!me?.property || !me?.year || !me?.month) {
        throw new Error("Property, year, or month is missing.");
      }

      const creditNote: ISupplierReturns = {
        id: "",
        supplierId: supplierId,
        balance: balance,
        referecnce: reference,
      };

      await api.body.supplierReturn.create(
        creditNote,
        me.property,
        me.year,
        me.month,
        supplierId
      );

      hideModalFromId(DIALOG_NAMES.BODY.CREATE_SUPPLIER_RETURN);
      SuccessfulAction(ui);
    } catch (error) {
      console.error(error);
      // Handle the error as needed (e.g., display a user-friendly message)
    }
    const bank_transaction: IBankingTransactions = {
      id: "",
      date: date,
      payee: supplierId,
      description: selection,
      type: "Supplier",
      selection: selection,
      reference: "Supplier Return",
      VAT: "Exempted",
      credit: "",
      debit: balance.toFixed(2),
    };
    try {
      if (me?.property && me?.bankAccountInUse)
        await api.body.banking_transaction.create(
          bank_transaction,
          me.property,
          me.bankAccountInUse
        );
      console.log("transaction created");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onCreate = () => {
    showModalFromId(DIALOG_NAMES.BODY.CREATE_SUPPLIER_RETURN);
  };

  useEffect(() => {
    const getData = async () => {
      if (me?.property) await api.body.supplier.getAll(me?.property);
      if (me?.property) await api.body.account.getAll(me?.property);
      if (me?.property && me?.year)
        await api.body.supplierReturn.getAll(me.property, me.year, me.month);
    };
    getData();
  }, []);

  const suppliers = store.bodyCorperate.supplier.all.map((u) => {
    return u.asJson;
  });

  return (
    <div>
      <Toolbar2
        leftControls={
          <div className="">
            <IconButton uk-tooltip="Create Supplier Return" onClick={onCreate}>
              <CreateNewFolderIcon />
            </IconButton>
          </div>
        }
        rightControls={
          <div>
            <IconButton uk-tooltip="Print invoices">
              <PrintIcon />
            </IconButton>
            <IconButton uk-tooltip="Export to pdf">
              <PictureAsPdfIcon />
            </IconButton>
            <IconButton uk-tooltip="Export to csv">
              <ArticleIcon />
            </IconButton>
          </div>
        }
      />
      <SupplierReturnGrid
        data={store.bodyCorperate.supplierReturn.all.map((u) => {
          return u.asJson;
        })}
        suppliers={suppliers}
      />

      <Modal modalId={DIALOG_NAMES.BODY.CREATE_SUPPLIER_RETURN}>
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
            // onClick={clear}
          ></button>
          <h4 style={{ textTransform: "uppercase" }} className="uk-modal-title">
            Create supplier return
          </h4>
          <form
            className="uk-grid-small"
            onSubmit={createSupplierReturn}
            data-uk-grid
          >
            <div className="uk-width-1-1 ">
              <label>Date</label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="uk-input"
                type="date"
                aria-label="25"
              />
            </div>
            <br />
            <div className="uk-width-1-1 ">
              <label>Supplier</label>
              <select
                className="uk-input"
                onChange={(e) => setSupplierId(e.target.value)}
                required
              >
                <option value="">Select Supplier</option>
                {store.bodyCorperate.supplier.all.map((u) => (
                  <option value={u.asJson.id}>
                    Unit {u.asJson.name} {u.asJson.description}
                  </option>
                ))}
              </select>
            </div>
            <br />
            <div className="uk-width-1-1 ">
              <label>Balance</label>
              <input
                className="uk-input"
                type="number"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                required
              />
            </div>
            <br />
            <div className="uk-width-1-1 ">
              <label>Reference</label>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="uk-input"
                type="text"
                aria-label="25"
              />
            </div>
            <br />
            <div className="uk-width-1-1 ">
              <label>Account </label>
              <select
                className="uk-input"
                onChange={(e) => setSelection(e.target.value)}
                required
              >
                <option value="">Select Account</option>
                {store.bodyCorperate.account.all.map((u) => (
                  <option value={u.asJson.id}>{u.asJson.name}</option>
                ))}
              </select>
            </div>

            <IconButton
              disabled={loading}
              type="submit"
            >
              <SaveIcon />
            </IconButton>
            {loading && <>loading...</>}
          </form>
        </div>
      </Modal>
    </div>
  );
});
