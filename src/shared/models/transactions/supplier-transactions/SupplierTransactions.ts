import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../stores/AppStore";

export const defaultSupplierTransaction: ISupplierTransactions = {
  id: "",
  supplierId: "",
  date: "",
  reference: "",
  transactionType: "",
  description: "",
  debit: "",
  credit: "",
  balance: "",
};

export interface ISupplierTransactions {
  id: string;
  supplierId: string;
  date: string;
  reference: string;
  transactionType: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
}

export default class SupplierTransactionModel {
  private supplier_transaction: ISupplierTransactions;

  constructor(
    private store: AppStore,
    supplier_transaction: ISupplierTransactions
  ) {
    makeAutoObservable(this);
    this.supplier_transaction = supplier_transaction;
  }

  get asJson(): ISupplierTransactions {
    return toJS(this.supplier_transaction);
  }
}
