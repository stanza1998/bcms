import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultFNB: IFNB = {
  id: "",
  propertyId: "",
  unitId: "",
  date: "",
  serviceFee: "",
  amount: 0,
  description: "",
  references: "",
  balance: 0,
  chequeNumber: 0,
  allocated: false
};

export interface IFNB {
  id: string;
  propertyId: string;
  unitId: string;
  date: string;
  serviceFee: string;
  amount: number;
  description: string;
  references: string;
  balance: number;
  chequeNumber: number;
  allocated: boolean;
}

export default class FNBModel {
  private fnb: IFNB;

  constructor(private store: AppStore, fnb: IFNB) {
    makeAutoObservable(this);
    this.fnb = fnb;
  }

  get asJson(): IFNB {
    return toJS(this.fnb);
  }
}
