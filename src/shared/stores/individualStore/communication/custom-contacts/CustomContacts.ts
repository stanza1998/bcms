import { runInAction } from "mobx";
import Store from "../../../Store";
import AppStore from "../../../AppStore";
import CustomContactModel, { ICustomContact } from "../../../../models/communication/contact-management/CustomContacts";

export default class CustomContactStore extends Store<
  ICustomContact,
  CustomContactModel
> {
  items = new Map<string, CustomContactModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ICustomContact[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new CustomContactModel(this.store, item))
      );
    });
  }
}
