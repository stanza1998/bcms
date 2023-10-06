import { runInAction } from "mobx";
import Store from "../../../Store";
import PrivateMessagetModel, {
  IPrivateMessage,
} from "../../../../models/communication/private-message/PrivateMessage";
import AppStore from "../../../AppStore";

export default class PrivateMessageStore extends Store<
  IPrivateMessage,
  PrivateMessagetModel
> {
  items = new Map<string, PrivateMessagetModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IPrivateMessage[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new PrivateMessagetModel(this.store, item))
      );
    });
  }
}
