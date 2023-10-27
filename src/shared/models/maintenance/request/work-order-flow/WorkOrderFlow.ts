import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../../stores/AppStore";

export const defaultMaintenanceworkOrder: IWorkOrderFlow = {
    id: "",
    workOrderNumber: 0,
    workOrderId: "",
    serviceProviderId: "",
    title: "",
    description: "",
    status: "Closed"
};

export interface IWorkOrderFlow {
    id: string;
    workOrderNumber: number;
    workOrderId: string;
    serviceProviderId: string;
    title: string;
    description: string;
    status: string;
}

export default class WorkOrderFlowModel {
    private workOrder: IWorkOrderFlow;

    constructor(private store: AppStore, workOrder: IWorkOrderFlow) {
        makeAutoObservable(this);
        this.workOrder = workOrder;
    }

    get asJson(): IWorkOrderFlow {
        return toJS(this.workOrder);
    }
}
