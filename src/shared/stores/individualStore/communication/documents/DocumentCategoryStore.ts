import { runInAction } from "mobx";
import Store from "../../../Store";
import AppStore from "../../../AppStore";
import DocumentCategoryModel, { IDocumentCategory } from "../../../../models/communication/documents/DocumentCategories";

export default class DocumentCategoryStore extends Store<
  IDocumentCategory,
  DocumentCategoryModel
> {
  items = new Map<string, DocumentCategoryModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IDocumentCategory[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.id, new DocumentCategoryModel(this.store, item))
      );
    });
  }
}
