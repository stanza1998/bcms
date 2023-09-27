import { runInAction } from "mobx";
import Store from "../../../Store";
import CustomerTransactionModel, { ICustomerTransactions } from "../../../../models/transactions/customer-transactions/CustomerTransactionModel";
import AppStore from "../../../AppStore";

export default class CustomerTransactionsStore extends Store<
  ICustomerTransactions,
  CustomerTransactionModel
> {
  items = new Map<string, CustomerTransactionModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ICustomerTransactions[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new CustomerTransactionModel(this.store, item))
      );
    });
  }
}
