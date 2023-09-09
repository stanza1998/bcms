import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import PropertyBankAccountModel, { IPropertyBankAccount } from "../../../models/property-bank-account/PropertyBankAccount";

export default class PropertyBankAccountStore extends Store<IPropertyBankAccount, PropertyBankAccountModel> {
  items = new Map<string, PropertyBankAccountModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IPropertyBankAccount[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new PropertyBankAccountModel(this.store, item))
      );
    });
  }
}
