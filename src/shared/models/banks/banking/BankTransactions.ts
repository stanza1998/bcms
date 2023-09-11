import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../stores/AppStore";

export const defaultTransactions: IBankingTransactions = {
    id: "",
    date: "",
    payee: "",
    description: "",
    type: "",
    selection: "",
    reference: "",
    VAT: "",
    credit: "",
    debit: ""
};

export interface IBankingTransactions {
  id: string;
  date: string;
  payee: string;
  description: string;
  type: string;
  selection: string;
  reference: string;
  VAT: string;
  credit:string;
  debit:string;
}

export default class BankingTransactionModel {
  private banking_transactions: IBankingTransactions;

  constructor(
    private store: AppStore,
    banking_transactions: IBankingTransactions
  ) {
    makeAutoObservable(this);
    this.banking_transactions = banking_transactions;
  }

  get asJson(): IBankingTransactions {
    return toJS(this.banking_transactions);
  }
}
