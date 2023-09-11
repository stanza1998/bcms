import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import AccountCategoryModel, {
  IAccountCategory,
} from "../../../models/Types/AccountCategories";

export default class AccountCategoryStore extends Store<
  IAccountCategory,
  AccountCategoryModel
> {
  items = new Map<string, AccountCategoryModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IAccountCategory[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new AccountCategoryModel(this.store, item))
      );
    });
  }
}
