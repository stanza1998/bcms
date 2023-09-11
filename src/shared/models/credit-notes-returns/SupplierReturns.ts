import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultSupplierReturns: ISupplierReturns = {
  id: "",
  supplierId: "",
  balance: 0,
  referecnce: "",
};

export interface ISupplierReturns {
  id: string;
  supplierId: string;
  balance: number;
  referecnce: string | "";
}

export default class SupplierReturnModel {
  private supplierReturn: ISupplierReturns;

  constructor(private store: AppStore, supplierReturn: ISupplierReturns) {
    makeAutoObservable(this);
    this.supplierReturn = supplierReturn;
  }

  get asJson(): ISupplierReturns {
    return toJS(this.supplierReturn);
  }
}
