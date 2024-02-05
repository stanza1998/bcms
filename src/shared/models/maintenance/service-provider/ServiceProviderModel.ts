import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../stores/AppStore";

export const defaultServiceProvider: IServiceProvider = {
    id: "",
    serviceProvideName: "",
    phoneNumber: "",
    email: "",
    dateCreated: "",
    specializationi: "",
    code: "",
};

export interface IServiceProvider {
    id: string;
    serviceProvideName: string;
    phoneNumber: string;
    email: string;
    dateCreated: string;
    specializationi: string;
    code: string;
}

export default class ServiceProviderModel {
    private serviceProvider: IServiceProvider;

    constructor(private store: AppStore, serviceProvider: IServiceProvider) {
        makeAutoObservable(this);
        this.serviceProvider = serviceProvider;
    }

    get asJson(): IServiceProvider {
        return toJS(this.serviceProvider);
    }
}
