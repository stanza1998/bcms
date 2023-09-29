import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../stores/AppStore";

export const defaulCustomerTransaction: ICustomerTransactions = {
  id: "",
  unitId: "",
  date: "",
  reference: "",
  transactionType: "",
  description: "",
  debit: "",
  credit: "",
  balance: "",
  balanceAtPointOfTime: "",
  invId: ""
};

export interface ICustomerTransactions {
  id: string;
  unitId: string;
  date: string;
  reference: string;
  transactionType: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
  balanceAtPointOfTime:string;
  invId:string;
}

export default class CustomerTransactionModel {
  private customer_transaction: ICustomerTransactions;

  constructor(
    private store: AppStore,
    customer_transaction: ICustomerTransactions
  ) {
    makeAutoObservable(this);
    this.customer_transaction = customer_transaction;
  }

  get asJson(): ICustomerTransactions {
    return toJS(this.customer_transaction);
  }
}
