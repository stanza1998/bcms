import AppStore from "../../AppStore";
import { runInAction } from "mobx";
import Store from "../../Store";
import RecuringInvoiceModel, {
  IRecuringInvoice,
} from "../../../models/invoices/RecuringInvoices";

export default class RecuringInvoiceStore extends Store<
  IRecuringInvoice,
  RecuringInvoiceModel
> {
  items = new Map<string, RecuringInvoiceModel>();

  constructor(store: AppStore) {
    super(store);
    this.store = store;
  }

  load(items: IRecuringInvoice[] = []) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(
          item.invoiceId,
          new RecuringInvoiceModel(this.store, item)
        )
      );
    });
  }
}
