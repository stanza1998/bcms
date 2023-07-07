import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import FinancialYearModel, { IFinancialYear } from "../../../models/yearModels/FinancialYear";

export default class FinancialYearStore extends Store<IFinancialYear, FinancialYearModel> {
  items = new Map<string, FinancialYearModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IFinancialYear[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new FinancialYearModel(this.store, item))
      );
    });
  }
}
