import { makeObservable, runInAction, toJS } from "mobx";
import SystemTheme, { ISystemTheme } from "../../models/Theme";
import AppStore from "../AppStore";

export default class SystemThemeStore {
  systemtheme: SystemTheme | null = null;
  store: AppStore;
  loading: boolean = false;

  constructor(store: AppStore) {
    makeObservable(this, {
      systemtheme: true,
      theme: true,
      loading: true
    });
    this.store = store;
  }

  get theme() {
    return this.systemtheme ? this.systemtheme.asJson : null;
  }

  setLoading() {
    runInAction(() => {
      this.loading = !this.loading;
    })
  }

  load(item: ISystemTheme | any) {
    runInAction(() => {
      this.systemtheme = new SystemTheme(this.store, item)
    })
  }
}
