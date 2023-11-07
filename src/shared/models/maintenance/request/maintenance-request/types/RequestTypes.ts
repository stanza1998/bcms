import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../../../stores/AppStore";

export const defaultRequestType: IRequestType = {
    id: "",
    typeName: "",
};

export interface IRequestType {
    id: string;
    typeName: string;
}

export default class RequestTypeModel {
    private requestType: IRequestType;

    constructor(private store: AppStore, requestType: IRequestType) {
        makeAutoObservable(this);
        this.requestType = requestType;
    }

    get asJson(): IRequestType {
        return toJS(this.requestType);
    }
}
