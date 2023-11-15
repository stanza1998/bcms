import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../../stores/AppStore";

export const defaultMaintenanceworkOrder: IWorkOrderFlow = {
    id: "",
    workOrderNumber: "",
    requestId: "",
    serviceProviderId: [],
    title: "",
    description: "",
    status: "Pending",
    successfullSP: "",
    dateCreated: "",
    startDate: "",
    completedDate: "",
    windowPeriod: "",
    quoteFiles:[],
    propertyId: ""
};

export interface IWorkOrderFlow {
    id: string;
    workOrderNumber: string;
    requestId: string;
    serviceProviderId: string[];
    title: string;
    description: string;
    status: string;
    successfullSP: string;
    dateCreated: string;
    startDate: string;
    completedDate: string;
    windowPeriod: string;
    quoteFiles: IQuoteFile[];

    propertyId: string;
}

export interface IQuoteFile {
    id: string;
    quoteFileurl: string;
    imageUrls: string[]
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
