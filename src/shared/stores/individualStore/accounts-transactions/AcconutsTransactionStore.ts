import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import AccountsTransactionModel, { IAccountTransactions } from "../../../models/accounts-transaction/AccountsTransactionModel";

export default class AccountsTransactionsStore extends Store<IAccountTransactions, AccountsTransactionModel> {
    items = new Map<string, AccountsTransactionModel>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IAccountTransactions[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new AccountsTransactionModel(this.store, item))
            );
        });
    }
}
