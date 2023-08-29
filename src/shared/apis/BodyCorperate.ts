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
import NEDBANKApi from "./bodyCorperate/NEDBANKApi";
import TransferApi from "./bodyCorperate/type/TransferApi";
import AccountApi from "./bodyCorperate/type/AccountApi";
import SupplierApi from "./bodyCorperate/type/SupplierApi";
import SupplierInvoiceApi from "./bodyCorperate/SupplierInvoices";

export default class BodyCorpetaApi {
  private BodyCoperateDB = collection(db, "BodyCoperate");
  private UnitDB = collection(db, "Unit");
  private FinacialYearDB = collection(db, "FinacialYear");
  private FinacialMonthDB = collection(db, "FinacialMonth");
  private InvoiceDB = collection(db, "Invoices");
  private RecuringInvoiceDB = collection(db, "RecuringInvoices");
  private CopiedInvoiceDB = collection(db, "CopiedInvoices");
  private SupplierInvoiceDB = collection(db, "SupplierInvoices");
  private FNBDB = collection(db, "FnbStatements");
  private NEDBANKBB = collection(db, "NedBankStatements");
  private supplierDB = collection(db, "Suppliers");
  private transferDB = collection(db, "Transfer");
  private accountDB = collection(db, "Account");

  body: BodyCopApi;
  unit: UnitApi;
  financialYear: FinancialYearApi;
  financialMonth: FinancialMonthApi;
  invoice: InvoiceApi;
  recuringInvoice: RecuringInvoiceApi;
  copiedInvoice: CopiedInvoiceApi;
  supplierInvoice: SupplierInvoiceApi;
  fnb: FNBApi;
  nedbank: NEDBANKApi;
  transfer: TransferApi;
  account: AccountApi;
  supplier: SupplierApi

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
    this.nedbank = new NEDBANKApi(api, store, this.NEDBANKBB);
    this.transfer = new TransferApi(api, store, this.transferDB);
    this.account = new AccountApi(api, store, this.accountDB);
    this.supplier = new SupplierApi(api, store, this.supplierDB);
    this.supplierInvoice = new SupplierInvoiceApi(api, store, this.SupplierInvoiceDB)
  }
}
