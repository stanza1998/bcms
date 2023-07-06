import Store from "../Store";
import { makeObservable, runInAction } from "mobx";
import AppStore from "../AppStore";
import { IUser } from "../../interfaces/IUser";
import { UserModel } from "../../models/User";

export default class UserStore extends Store<IUser, UserModel> {
  items = new Map<string, UserModel>();
  me: UserModel | null = null;
  loading: boolean = true;

  constructor(store: AppStore) {
    super(store);
    makeObservable(this, {
      me: true,
      loading: true,
      meJson: true,
    });
    this.store = store;
  }

  // get uid
  get meJson() {
    return this.me ? this.me.asJson : null;
  }

  // get role
  get role() {
    const _role = this.me ? this.me.asJson.role : "Employee";
    return _role as "Employee" | "GM" | "RM" | "Admin";
  }

  get department() {
    return this.me ? this.me.asJson.departmentId : null;
  }

  // get region
  get region() {
    return this.me ? this.me.asJson.regionId : null;
  }

  load(items: IUser[]) {
    runInAction(() => {
      items.forEach((item) =>
        this.items.set(item.uid, new UserModel(this.store, item))
      );
    });
  }

  loadCurrentUser(item: IUser) {
    runInAction(() => {
      this.me = new UserModel(this.store, item);
    });
  }

  removeCurrentUser() {
    runInAction(() => {
      this.me = null;
    });
  }
}
