import AppStore from "../AppStore";
import FNBStore from "../individualStore/banks/FNBStore";
import NEDBANKStore from "../individualStore/banks/NEDBANKStore";
import CopiedInvoiceStore from "../individualStore/invoice/CopiedInvoiceStore";
import InvoiceStore from "../individualStore/invoice/InvoiceStore";
import RecuringInvoiceStore from "../individualStore/invoice/RecuringInvoice";
import SupplierInvoiceStore from "../individualStore/invoice/SupplierInvoiceStore";
import FinancialMonthStore from "../individualStore/months/FinancialMonth";
import BodyCopStore from "../individualStore/properties/BodyCopStore";
import UnitStore from "../individualStore/properties/UnitStore";
import ReceiptsPaymentStore from "../individualStore/receipts-payments/ReceiptsPaymentStore";
import AccountStore from "../individualStore/type/AccountStore";
import SupplierStore from "../individualStore/type/SupplierStore";
import TransferStore from "../individualStore/type/Transfer";
import FinancialYearStore from "../individualStore/years/FinancialYear";

export default class BodyCorporateStore {
  bodyCop: BodyCopStore;
  unit: UnitStore;
  financialYear: FinancialYearStore;
  financialMonth: FinancialMonthStore;
  invoice: InvoiceStore;
  recuringInvoice: RecuringInvoiceStore;
  copiedInvoices: CopiedInvoiceStore;
  fnb: FNBStore;
  nedbank: NEDBANKStore;
  supplier: SupplierStore;
  transfer: TransferStore;
  account: AccountStore;
  supplierInvoice: SupplierInvoiceStore;
  receiptsPayments: ReceiptsPaymentStore;

  constructor(store: AppStore) {
    this.bodyCop = new BodyCopStore(store);
    this.unit = new UnitStore(store);
    this.financialYear = new FinancialYearStore(store);
    this.financialMonth = new FinancialMonthStore(store);
    this.invoice = new InvoiceStore(store);
    this.recuringInvoice = new RecuringInvoiceStore(store);
    this.copiedInvoices = new CopiedInvoiceStore(store);
    this.fnb = new FNBStore(store);
    this.nedbank = new NEDBANKStore(store);
    this.supplier = new SupplierStore(store);
    this.transfer = new TransferStore(store);
    this.account = new AccountStore(store);
    this.supplierInvoice = new SupplierInvoiceStore(store);
    this.receiptsPayments = new ReceiptsPaymentStore(store);
  }
}
