import DepartmentStore from "./individualStore/DepartmentStore";
import BodyCorporateStore from "./groupStore/BodyCorporateStore";
import UserStore from "./individualStore/UserStore";
import SystemThemeStore from "./individualStore/SystemThemeStore";

export default class AppStore {
  department = new DepartmentStore(this);
  user = new UserStore(this);
  settings = new SystemThemeStore(this);
  bodyCorperate = new BodyCorporateStore(this);
}
