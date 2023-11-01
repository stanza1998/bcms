import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultSupplier: ISupplier = {
  id: "",
  name: "",
  description: "",
  balance: 0,
  mobileNumber: "",
  telephoneNumber: "",
  emailAddress: ""
};

export interface ISupplier {
  id: string;
  name: string;
  description: string;
  balance: number;
  mobileNumber: string;
  telephoneNumber: string;
  emailAddress?:string;
}

export default class SupplierModel {
  private supplier: ISupplier;

  constructor(private store: AppStore, supplier: ISupplier) {
    makeAutoObservable(this);
    this.supplier = supplier;
  }

  get asJson(): ISupplier {
    return toJS(this.supplier);
  }
}
