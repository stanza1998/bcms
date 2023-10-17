import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import PopModel, { IPop } from "../../../models/proof-of-payment/PopModel";

export default class PopStore extends Store<IPop, PopModel> {
    items = new Map<string, PopModel>();
  
    constructor(store: AppStore) {
      super(store);
      this.store = store;
    }
  
    load(items: IPop[] = []) {
      runInAction(() => {
        items.forEach((item) =>
          this.items.set(item.popId, new PopModel(this.store, item))
        );
      });
    }
  }