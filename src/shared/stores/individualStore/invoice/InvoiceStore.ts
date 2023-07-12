import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";

import InvoiceModel, { IInvoice } from "../../../models/invoices/Invoices";

export default class InvoiceStore extends Store<IInvoice, InvoiceModel> {
  items = new Map<string, InvoiceModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IInvoice[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.invoiceId, new InvoiceModel(this.store, item))
      );
    });
  }
}
