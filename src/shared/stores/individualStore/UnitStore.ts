import AppStore from "../AppStore";
import { runInAction } from "mobx";
import Store from "../Store";
import UnitModel, { IUnit } from "../../models/bcms/Units";

export default class UnitStore extends Store<IUnit, UnitModel> {
  items = new Map<string, UnitModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IUnit[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new UnitModel(this.store, item))
      );
    });
  }
}
