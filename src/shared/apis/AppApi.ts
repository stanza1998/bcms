import AppStore from "../stores/AppStore";
import { collection } from "firebase/firestore";
import { db } from "../database/FirebaseConfig";
import DepartmentApi from "./DepartmentApi";
import UserApi from "./UserApi";
import SystemSettingsApi from "./SystemSettingsApi";
import BodyCorpetaApi from "./BodyCorperate";
import EmailApi from "./email-notifiction-function/EmailApi";
import UnitApi from "./bodyCorperate/customers/UnitApi";
import CommunicationApi from "./CommunicationApi";
import MaintenanceApi from "./MaintenanceApi";
import UiStore from "../stores/UiStore";

export const apiPathProperty = (
  category: "Units" | "FinancialYear"
): string => {
  return `BodyCoperate/Kro9GBJpsTULxDsFSl4d/${category}`;
};

export default class AppApi {
  private mailUri = "https://www.koshaservices.com/php/bcms.php?";
  private departmentDB = collection(db, "Departments");
  private regionDB = collection(db, "Regions");
  private payrollFolderDB = collection(db, "Folders");

  // api endpoints
  department: DepartmentApi;
  auth: UserApi;
  body: BodyCorpetaApi;
  communication: CommunicationApi;
  maintenance: MaintenanceApi;
  mail: EmailApi;
  unit: UnitApi;
  namibianRegion: unknown;

  // settings
  settings: SystemSettingsApi;

  constructor(private store: AppStore, private ui: UiStore) {
    this.department = new DepartmentApi(this, this.store, this.departmentDB);
    this.auth = new UserApi(this, this.store);
    this.settings = new SystemSettingsApi(this, store);
    this.body = new BodyCorpetaApi(this, store);
    this.communication = new CommunicationApi(this, store);
    this.maintenance = new MaintenanceApi(this, store);
    this.unit = new UnitApi(this, store, ui);
    this.mail = new EmailApi(this, store, this.mailUri);
  }
}
