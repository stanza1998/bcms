import AppStore from "../stores/AppStore";
import { collection } from "firebase/firestore";
import { db } from "../database/FirebaseConfig";
import DepartmentApi from "./DepartmentApi";
import UserApi from "./UserApi";
import SystemSettingsApi from "./SystemSettingsApi";
import BodyCorpetaApi from "./BodyCorperate";

export default class AppApi {
  // private mailUri = "https://unicomms.app/php/payroll.php?";

  private mailUri = "https://leave.lotsinsights.com/php/mailer.php?";

  // private mailUri = "https://unicomms.app/php/mailer.php?";
  private departmentDB = collection(db, "Departments");
  private regionDB = collection(db, "Regions");
  private payrollFolderDB = collection(db, "Folders");

  // api endpoints
  department: DepartmentApi;
  auth: UserApi;
  body: BodyCorpetaApi;

  namibianRegion: unknown;

  // settings
  settings: SystemSettingsApi;

  constructor(private store: AppStore) {
    this.department = new DepartmentApi(this, this.store, this.departmentDB);
    this.auth = new UserApi(this, this.store);
    this.settings = new SystemSettingsApi(this, store);
    this.body = new BodyCorpetaApi(this, store);
  }
}
