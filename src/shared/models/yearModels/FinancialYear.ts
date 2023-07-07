import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultFinancialYear: IFinancialYear = {
    id: "",
    year:0 
};

export interface IFinancialYear {
    id: string;
    year: number;

}

export default class FinancialYearModel {
    private financeYear: IFinancialYear;

    constructor(private store: AppStore, financeYear: IFinancialYear) {
        makeAutoObservable(this);
        this.financeYear = financeYear;
    }

    get asJson(): IFinancialYear {
        return toJS(this.financeYear);
    }
}