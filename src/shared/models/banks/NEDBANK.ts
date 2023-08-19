import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultnedbank: INEDBANK = {
  id: "",
  propertyId: "",
  unitId: "",
  transactionDate: "",
  valueDate: "",

  transactionReference: "",
  vatIndicator: "",
  debit: 0,
  credit: 0,
  balance: 0,
  allocated: false,
  invoiceNumber: "",
  expenses: false,
  description: "",
};

export interface INEDBANK {
  id: string;
  propertyId: string;
  unitId: string;
  transactionDate: string;
  valueDate: string;
  description: string;
  transactionReference: string;
  vatIndicator: string;
  debit: number;
  credit: number;
  balance: number;
  allocated: boolean;
  invoiceNumber: string;
  expenses: boolean;
}

export default class NEDBANKModel {
  private nedbank: INEDBANK;

  constructor(private store: AppStore, nedbank: INEDBANK) {
    makeAutoObservable(this);
    this.nedbank = nedbank;
  }

  get asJson(): INEDBANK {
    return toJS(this.nedbank);
  }
}
