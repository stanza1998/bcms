import { collection } from "firebase/firestore";
import { db } from "../database/FirebaseConfig";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import BodyCopApi from "./bodyCorperate/BodyCopApi";
import UnitApi from "./bodyCorperate/UnitApi";

export default class BodyCorpetaApi {
  private BodyCoperateDB = collection(db, "BodyCoperate");
  private UnitDB = collection(db, "Unit");

  body: BodyCopApi;
  unit: UnitApi;

  constructor(api: AppApi, store: AppStore) {
    this.body = new BodyCopApi(api, store, this.BodyCoperateDB);
    this.unit = new UnitApi(api, store, this.UnitDB);
  }
}
