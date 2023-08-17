import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import FNBModel, { IFNB } from "../../../models/banks/FNBModel";

export default class FNBStore extends Store<IFNB, FNBModel> {
  items = new Map<string, FNBModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IFNB[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new FNBModel(this.store, item))
      );
    });
  }
}
