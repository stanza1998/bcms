import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultAccount: INormalAccount = {
    id: "",
    name: "",
    description: ""
};

export interface INormalAccount {
  id: string;
  name:string;
  description:string;
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
