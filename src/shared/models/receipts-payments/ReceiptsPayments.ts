import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultReceiptsPayments: IReceiptsPayments = {
  id: "",
  date: "",
  reference: "",
  transactionType: "",
  description: "",
  debit: "",
  credit: "",
  balance: "",
  propertyId: "",
  unitId: "",
  invoiceNumber: "",
  rcp: "",
  supplierId: ""
};

export interface IReceiptsPayments {
  id: string;
  date: string;
  reference: string;
  transactionType: string;
  description: string;
  debit: string;
  credit: string;
  balance: string;
  propertyId: string;
  unitId: string;
  invoiceNumber: string;
  rcp: string;
  supplierId:string;
}

export default class ReceiptsPayments {
  private receiptsPayments: IReceiptsPayments;

  constructor(private store: AppStore, receiptsPayments: IReceiptsPayments) {
    makeAutoObservable(this);
    this.receiptsPayments = receiptsPayments;
  }

  get asJson(): IReceiptsPayments {
    return toJS(this.receiptsPayments);
  }
}
