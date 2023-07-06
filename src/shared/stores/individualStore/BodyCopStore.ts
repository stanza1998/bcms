import AppStore from "../AppStore";
import { runInAction } from "mobx";
import Store from "../Store";
import BodyCop, { IBodyCop } from "../../models/bcms/BodyCorperate";

export default class BodyCopStore extends Store<IBodyCop, BodyCop> {
    items = new Map<string, BodyCop>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IBodyCop[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new BodyCop(this.store, item))
            );
        });
    }
}
