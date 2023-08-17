import AppStore from "../AppStore";
import FNBStore from "../individualStore/banks/FNBStore";
import CopiedInvoiceStore from "../individualStore/invoice/CopiedInvoiceStore";
import InvoiceStore from "../individualStore/invoice/InvoiceStore";
import RecuringInvoiceStore from "../individualStore/invoice/RecuringInvoice";
import FinancialMonthStore from "../individualStore/months/FinancialMonth";
import BodyCopStore from "../individualStore/properties/BodyCopStore";
import UnitStore from "../individualStore/properties/UnitStore";
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

  constructor(store: AppStore) {
    this.bodyCop = new BodyCopStore(store);
    this.unit = new UnitStore(store);
    this.financialYear = new FinancialYearStore(store);
    this.financialMonth = new FinancialMonthStore(store);
    this.invoice = new InvoiceStore(store);
    this.recuringInvoice = new RecuringInvoiceStore(store);
    this.copiedInvoices = new CopiedInvoiceStore(store);
    this.fnb = new FNBStore(store);
  }
}
