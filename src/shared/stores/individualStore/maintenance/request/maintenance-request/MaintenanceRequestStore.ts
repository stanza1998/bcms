import { runInAction } from "mobx";
import MaintenanceRequestModel, { IMaintenanceRequest } from "../../../../../models/maintenance/request/maintenance-request/MaintenanceRequest";
import AppStore from "../../../../AppStore";
import Store from "../../../../Store";


export default class MaintenanceRequestStore extends Store<IMaintenanceRequest, MaintenanceRequestModel> {
    items = new Map<string, MaintenanceRequestModel>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IMaintenanceRequest[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new MaintenanceRequestModel(this.store, item))
            );
        });
    }
}