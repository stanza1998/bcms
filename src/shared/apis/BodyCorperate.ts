import { collection } from "firebase/firestore";
import { db } from "../database/FirebaseConfig";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import BodyCopApi from "./bodyCorperate/customers/BodyCopApi";
import UnitApi from "./bodyCorperate/customers/UnitApi";
import FinancialYearApi from "./bodyCorperate/periods/FinancialYearApi";
import FinancialMonthApi from "./bodyCorperate/periods/FinancialMonth";
import InvoiceApi from "./bodyCorperate/invoices/customer-inovices/InvoiceApi";
import RecuringInvoiceApi from "./bodyCorperate/RecuringInvoice";
import CopiedInvoiceApi from "./bodyCorperate/invoices/customer-inovices/CopiedInvoiceApi";
import FNBApi from "./bodyCorperate/banks/FNBApi";
import NEDBANKApi from "./bodyCorperate/banks/NEDBANKApi";
import TransferApi from "./bodyCorperate/type/TransferApi";
import AccountApi from "./bodyCorperate/type/AccountApi";
import SupplierApi from "./bodyCorperate/type/SupplierApi";
import SupplierInvoiceApi from "./bodyCorperate/invoices/supplier-invoices/SupplierInvoices";
import ReceiptPaymentsApi from "./bodyCorperate/receiptsPayments/ReceiptPaymentsApi";

export default class BodyCorpetaApi {
  private BodyCoperateDB = collection(db, "BodyCoperate");

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
  // unit: UnitApi;
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
  supplier: SupplierApi;
  receiptPayments: ReceiptPaymentsApi;

  constructor(api: AppApi, store: AppStore) {
    this.body = new BodyCopApi(api, store, this.BodyCoperateDB);
    this.financialYear = new FinancialYearApi(api, store);
    this.financialMonth = new FinancialMonthApi(api, store);
    this.invoice = new InvoiceApi(api, store);
    this.fnb = new FNBApi(api, store);
    this.receiptPayments = new ReceiptPaymentsApi(api, store);
    this.copiedInvoice = new CopiedInvoiceApi(api, store);
    this.nedbank = new NEDBANKApi(api, store, this.NEDBANKBB);
    this.transfer = new TransferApi(api, store, this.transferDB);
    this.account = new AccountApi(api, store, this.accountDB);
    this.supplier = new SupplierApi(api, store);
    this.supplierInvoice = new SupplierInvoiceApi(api, store);

    //   not needed
    this.recuringInvoice = new RecuringInvoiceApi(
      api,
      store,
      this.RecuringInvoiceDB
    );
  }
}
