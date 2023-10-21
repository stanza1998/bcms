import { runInAction } from "mobx";
import AppStore from "../../../../AppStore";
import Store from "../../../../Store";
import WorkOrderFlowModel, { IWorkOrderFlow } from "../../../../../models/maintenance/request/work-order-flow/WorkOrderFlow";


export default class WorkOderFlowStore extends Store<IWorkOrderFlow, WorkOrderFlowModel> {
    items = new Map<string, WorkOrderFlowModel>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IWorkOrderFlow[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new WorkOrderFlowModel(this.store, item))
            );
        });
    }
}