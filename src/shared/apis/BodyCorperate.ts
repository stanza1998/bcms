import { collection } from "firebase/firestore";
import { db } from "../database/FirebaseConfig";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import BodyCopApi from "./bodyCorperate/BodyCopApi";
import UnitApi from "./bodyCorperate/UnitApi";
import FinancialYearApi from "./bodyCorperate/FinancialYearApi";
import FinancialMonthApi from "./bodyCorperate/FinancialMonth";
import InvoiceApi from "./bodyCorperate/InvoiceApi";

export default class BodyCorpetaApi {
  private BodyCoperateDB = collection(db, "BodyCoperate");
  private UnitDB = collection(db, "Unit");
  private FinacialYearDB = collection(db, "FinacialYear");
  private FinacialMonthDB = collection(db, "FinacialMonth");
  private InvoiceDB = collection(db, "Invoices");

  body: BodyCopApi;
  unit: UnitApi;
  financialYear: FinancialYearApi;
  financialMonth: FinancialMonthApi;
  invoice: InvoiceApi;

  constructor(api: AppApi, store: AppStore) {
    this.body = new BodyCopApi(api, store, this.BodyCoperateDB);
    this.unit = new UnitApi(api, store, this.UnitDB);
    this.financialYear = new FinancialYearApi(api, store, this.FinacialYearDB);
    this.financialMonth = new FinancialMonthApi(
      api,
      store,
      this.FinacialMonthDB
    );
    this.invoice = new InvoiceApi(api, store, this.InvoiceDB);
  }
}
