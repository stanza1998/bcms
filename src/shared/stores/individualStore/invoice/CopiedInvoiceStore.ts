import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import CopiedInvoiceModel, { ICopiedInvoice } from "../../../models/invoices/CopyInvoices";


export default class CopiedInvoiceStore extends Store<ICopiedInvoice, CopiedInvoiceModel> {
  items = new Map<string, CopiedInvoiceModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ICopiedInvoice[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.invoiceId, new CopiedInvoiceModel(this.store, item))
      );
    });
  }
}
