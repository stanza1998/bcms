import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import SupplierModel, { ISupplier } from "../../../models/Types/Suppliers";

export default class UnitStore extends Store<ISupplier, SupplierModel> {
  items = new Map<string, SupplierModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ISupplier[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new SupplierModel(this.store, item))
      );
    });
  }
}
