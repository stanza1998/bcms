import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import SupplierInvoicesModel, { ISupplierInvoices } from "../../../models/invoices/SupplierInvoice";


export default class SupplierInvoiceStore extends Store<ISupplierInvoices, SupplierInvoicesModel> {
  items = new Map<string, SupplierInvoicesModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: ISupplierInvoices[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.invoiceId, new SupplierInvoicesModel(this.store, item))
      );
    });
  }
}
