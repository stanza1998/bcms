import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultBodyCop: IBodyCop = {
    id: "",
    BodyCopName: "",
   
};

export interface IBodyCop {
    id: string;
    BodyCopName: string;

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