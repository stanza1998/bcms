import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultFinancialMonth: IFinancialMonth = {
  id: "",
  month: "",
  active: false,
};

export interface IFinancialMonth {
  id: string;
  month: string;
  active: boolean;
}

export default class FinancialMonthModel {
  private financeMonth: IFinancialMonth;

  constructor(private store: AppStore, financeMonth: IFinancialMonth) {
    makeAutoObservable(this);
    this.financeMonth = financeMonth;
  }

  get asJson(): IFinancialMonth {
    return toJS(this.financeMonth);
  }
}
