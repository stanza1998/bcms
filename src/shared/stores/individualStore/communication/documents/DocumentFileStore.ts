import { runInAction } from "mobx";
import Store from "../../../Store";
import AppStore from "../../../AppStore";
import DocumentFileModel, { IDocumentFile } from "../../../../models/communication/documents/DocumentFiles";

export default class DocumentFileStore extends Store<
  IDocumentFile,
  DocumentFileModel
> {
  items = new Map<string, DocumentFileModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IDocumentFile[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new DocumentFileModel(this.store, item))
      );
    });
  }
}
