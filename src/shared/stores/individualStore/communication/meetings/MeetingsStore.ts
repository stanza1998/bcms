import { runInAction } from "mobx";
import Store from "../../../Store";
import AppStore from "../../../AppStore";
import MeetingModel, { IMeeting } from "../../../../models/communication/meetings/Meeting";

export default class MeetingStore extends Store<
    IMeeting,
    MeetingModel
> {
    items = new Map<string, MeetingModel>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IMeeting[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new MeetingModel(this.store, item))
            );
        });
    }
}
