import { runInAction } from "mobx";
import Store from "../../../Store";
import AppStore from "../../../AppStore";
import SupplierTransactionModel, {
  ISupplierTransactions,
} from "../../../../models/transactions/supplier-transactions/SupplierTransactions";

export default class SupplierTransactionsStore extends Store<
  ISupplierTransactions,
  SupplierTransactionModel
> {
  items = new Map<string, SupplierTransactionModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ISupplierTransactions[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new SupplierTransactionModel(this.store, item))
      );
    });
  }
}
