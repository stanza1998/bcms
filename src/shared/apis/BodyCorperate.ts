import { collection } from "firebase/firestore";
import { db } from "../database/FirebaseConfig";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import BodyCopApi from "./bodyCorperate/BodyCopApi";
import UnitApi from "./bodyCorperate/UnitApi";
import FinancialYearApi from "./bodyCorperate/FinancialYearApi";
import FinancialMonthApi from "./bodyCorperate/FinancialMonth";
import InvoiceApi from "./bodyCorperate/InvoiceApi";
import RecuringInvoiceApi from "./bodyCorperate/RecuringInvoice";
import CopiedInvoiceApi from "./bodyCorperate/CopiedInvoiceApi";
import FNBApi from "./bodyCorperate/FNBApi";

export default class BodyCorpetaApi {
  private BodyCoperateDB = collection(db, "BodyCoperate");
  private UnitDB = collection(db, "Unit");
  private FinacialYearDB = collection(db, "FinacialYear");
  private FinacialMonthDB = collection(db, "FinacialMonth");
  private InvoiceDB = collection(db, "Invoices");
  private RecuringInvoiceDB = collection(db, "RecuringInvoices");
  private CopiedInvoiceDB = collection(db, "CopiedInvoices");
  private FNBDB = collection(db, "FnbStatements");

  body: BodyCopApi;
  unit: UnitApi;
  financialYear: FinancialYearApi;
  financialMonth: FinancialMonthApi;
  invoice: InvoiceApi;
  recuringInvoice: RecuringInvoiceApi;
  copiedInvoice: CopiedInvoiceApi;
  fnb: FNBApi;

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
    this.recuringInvoice = new RecuringInvoiceApi(
      api,
      store,
      this.RecuringInvoiceDB
    );
    this.fnb = new FNBApi(api, store, this.FNBDB);
    this.copiedInvoice = new CopiedInvoiceApi(api, store, this.CopiedInvoiceDB);
  }
}
