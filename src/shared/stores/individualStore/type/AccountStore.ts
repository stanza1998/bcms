import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import AccountModel, { INormalAccount } from "../../../models/Types/Account";

export default class AccountStore extends Store<INormalAccount, AccountModel> {
  items = new Map<string, AccountModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: INormalAccount[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new AccountModel(this.store, item))
      );
    });
  }
}
