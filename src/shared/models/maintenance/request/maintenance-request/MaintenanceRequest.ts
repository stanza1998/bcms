import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../../stores/AppStore";

export const defaultMaintenanceRequest: IMaintenanceRequest = {
    id: "",
    ownerId: "",
    unitId: "",
    description: "",
    dateRequested: "",
    status: "Closed",
    startDate: "",
    completedDate: "",
    workerOrderLatestNumber: 0
};

export interface IMaintenanceRequest {
    id: string;
    ownerId: string;
    unitId: string;
    description: string;
    dateRequested: string;
    startDate: string;
    completedDate: string;
    status: string;
    workerOrderLatestNumber: number;
}

export default class MaintenanceRequestModel {
    private request: IMaintenanceRequest;

    constructor(private store: AppStore, request: IMaintenanceRequest) {
        makeAutoObservable(this);
        this.request = request;
    }

    get asJson(): IMaintenanceRequest {
        return toJS(this.request);
    }
}
