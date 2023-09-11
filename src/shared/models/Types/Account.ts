import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultAccount: INormalAccount = {
  id: "",
  name: "",
  description: "",
  category: "",
  balance: 0
};

export interface INormalAccount {
  id: string;
  name:string;
  category: string;
  description:string;
  balance:number;

}

export default class AccountModel {
  private account: INormalAccount;

  constructor(private store: AppStore, account: INormalAccount) {
    makeAutoObservable(this);
    this.account = account;
  }

  get asJson(): INormalAccount {
    return toJS(this.account);
  }
}
