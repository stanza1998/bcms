import { runInAction } from "mobx";
import Store from "../../../Store";
import AppStore from "../../../AppStore";
import MeetingFolderModel, { IMeetingFolder } from "../../../../models/communication/meetings/MeetingFolder";

export default class MeetingFolderStore extends Store<
  IMeetingFolder,
  MeetingFolderModel
> {
  items = new Map<string, MeetingFolderModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IMeetingFolder[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new MeetingFolderModel(this.store, item))
      );
    });
  }
}
