import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import ReceiptsPayments, { IReceiptsPayments } from "../../../models/receipts-payments/ReceiptsPayments";

export default class ReceiptsPaymentStore extends Store<IReceiptsPayments, ReceiptsPayments> {
  items = new Map<string, ReceiptsPayments>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IReceiptsPayments[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new ReceiptsPayments(this.store, item))
      );
    });
  }
}
