import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import SupplierReturnModel, { ISupplierReturns } from "../../../models/credit-notes-returns/SupplierReturns";

export default class SupplierReturnStore extends Store<
  ISupplierReturns,
  SupplierReturnModel
> {
  items = new Map<string, SupplierReturnModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ISupplierReturns[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new SupplierReturnModel(this.store, item))
      );
    });
  }
}
