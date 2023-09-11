import { runInAction } from "mobx";
import Store from "../../../Store";
import BankingTransactionModel, {
  IBankingTransactions,
} from "../../../../models/banks/banking/BankTransactions";
import AppStore from "../../../AppStore";

export default class BankingTransactionStore extends Store<
  IBankingTransactions,
  BankingTransactionModel
> {
  items = new Map<string, BankingTransactionModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IBankingTransactions[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new BankingTransactionModel(this.store, item))
      );
    });
  }
}
