import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultAccountTransactions: IAccountTransactions = {
    id: "",
    date: "",
    BankCustomerSupplier: "",
    reference: "",
    transactionType: "",
    description: "",
    debit: 0,
    credit: 0,
    balance: 0,
    accounntType: ""
};

export interface IAccountTransactions {
    id: string;
    date: string
    BankCustomerSupplier: string;
    reference: string;
    transactionType: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
    accounntType: string;
}

export default class AccountsTransactionModel {
    private account_transaction: IAccountTransactions;

    constructor(private store: AppStore, account_transaction: IAccountTransactions) {
        makeAutoObservable(this);
        this.account_transaction = account_transaction;
    }

    get asJson(): IAccountTransactions {
        return toJS(this.account_transaction);
    }
}
