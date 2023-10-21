import { runInAction } from "mobx";
import Store from "../../../../../Store";
import RequestTypeModel, { IRequestType } from "../../../../../../models/maintenance/request/maintenance-request/types/RequestTypes";
import AppStore from "../../../../../AppStore";


export default class RequestTypeStore extends Store<IRequestType, RequestTypeModel> {
    items = new Map<string, RequestTypeModel>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IRequestType[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new RequestTypeModel(this.store, item))
            );
        });
    }
}