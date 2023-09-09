import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultPropertyBankAccount: IPropertyBankAccount = {
  id: "",
  name: "",
  totalBalance: 0,
};

export interface IPropertyBankAccount {
  id: string;
  name: string;
  totalBalance: number;
}

export default class PropertyBankAccountModel {
  private transfer: IPropertyBankAccount;

  constructor(private store: AppStore, transfer: IPropertyBankAccount) {
    makeAutoObservable(this);
    this.transfer = transfer;
  }

  get asJson(): IPropertyBankAccount {
    return toJS(this.transfer);
  }
}
