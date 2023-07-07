import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import FinancialMonthModel, { IFinancialMonth } from "../../../models/monthModels/FinancialMonth";

export default class FinancialMonthStore extends Store<IFinancialMonth, FinancialMonthModel> {
  items = new Map<string, FinancialMonthModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IFinancialMonth[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new FinancialMonthModel(this.store, item))
      );
    });
  }
}
