import { runInAction } from "mobx";
import Store from "../../../Store";
import AnnouncementModel, {
  IAnnouncements,
} from "../../../../models/communication/announcements/AnnouncementModel";
import AppStore from "../../../AppStore";

export default class AnnouncementStore extends Store<
  IAnnouncements,
  AnnouncementModel
> {
  items = new Map<string, AnnouncementModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IAnnouncements[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new AnnouncementModel(this.store, item))
      );
    });
  }
}
