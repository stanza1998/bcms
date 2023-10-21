import { runInAction } from "mobx";
import Store from "../../../Store";
import ServiceProviderModel, { IServiceProvider } from "../../../../models/maintenance/service-provider/ServiceProviderModel";
import AppStore from "../../../AppStore";

export default class ServiceProviderStore extends Store<IServiceProvider, ServiceProviderModel> {
    items = new Map<string, ServiceProviderModel>();
  
    constructor(store: AppStore) {
      super(store);
      this.store = store;
    }
  
    load(items: IServiceProvider[] = []) {
      runInAction(() => {
        items.forEach((item) =>
          this.items.set(item.id, new ServiceProviderModel(this.store, item))
        );
      });
    }
  }