import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import NEDBANKModel, { INEDBANK } from "../../../models/banks/NEDBANK";

export default class NEDBANKStore extends Store<INEDBANK, NEDBANKModel> {
  items = new Map<string, NEDBANKModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: INEDBANK[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new NEDBANKModel(this.store, item))
      );
    });
  }
}
