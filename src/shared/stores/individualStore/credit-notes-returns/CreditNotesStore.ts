import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import CreditNoteModel, {
  ICreditNote,
} from "../../../models/credit-notes-returns/CreditNotesReturns";

export default class CreditNoteStore extends Store<
  ICreditNote,
  CreditNoteModel
> {
  items = new Map<string, CreditNoteModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ICreditNote[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new CreditNoteModel(this.store, item))
      );
    });
  }
}
