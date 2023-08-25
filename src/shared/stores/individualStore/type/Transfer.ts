import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import TransferModel, { ITransfer } from "../../../models/Types/Transfer";

export default class TransferStore extends Store<ITransfer, TransferModel> {
  items = new Map<string, TransferModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ITransfer[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new TransferModel(this.store, item))
      );
    });
  }
}
