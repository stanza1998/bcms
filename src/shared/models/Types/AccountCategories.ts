import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultaccountCategory: IAccountCategory = {
  id: "",
  name: "",
  description: "",
};

export interface IAccountCategory {
  id: string;
  name: string;
  description: string;
}

export default class AccountCategoryModel {
  private accountCategory: IAccountCategory;

  constructor(private store: AppStore, accountCategory: IAccountCategory) {
    makeAutoObservable(this);
    this.accountCategory = accountCategory;
  }

  get asJson(): IAccountCategory {
    return toJS(this.accountCategory);
  }
}
