import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultBodyCop: IBodyCop = {
    id: "",
    BodyCopName: "",
    location: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    branchName: "",
    branchCode: "",
    accountStyle: "",
    swift: ""
};

export interface IBodyCop {
    id: string;
    BodyCopName: string;
    location: string;
    bankName: string;
    accountName:string;
    accountNumber: string;
    branchName: string;
    branchCode: string;
    accountStyle: string;
    swift: string;

}

export default class BodyCop {
    private bodyCop: IBodyCop;

    constructor(private store: AppStore, bodyCop: IBodyCop) {
        makeAutoObservable(this);
        this.bodyCop = bodyCop;
    }

    get asJson(): IBodyCop {
        return toJS(this.bodyCop);
    }
}