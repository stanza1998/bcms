import { collection } from "firebase/firestore";
import { db } from "../database/FirebaseConfig";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import BodyCopApi from "./bodyCorperate/customers/BodyCopApi";
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
import CreditNoteApi from "./bodyCorperate/credit-notes-returns/CreditNoteApi";
import ProperyBankAccountApi from "./bodyCorperate/prperty-bank-account/PropertyBankAccountApi";
import SupplierReturnApi from "./bodyCorperate/credit-notes-returns/SupplierReturns";
import AccountCategoryApi from "./bodyCorperate/type/AccountCategoryApi";
import BankingTransactionsApi from "./bodyCorperate/banks/banking/BankingTransactionApi";
import CustomerTransactionApi from "./bodyCorperate/transactions/customer-transactions/CustomerTransactionApi";
import SupplierTransactionApi from "./bodyCorperate/transactions/supplier-transactions/SupplierTransactionApi";
import PopApi from "./bodyCorperate/proof-of-payment/PopApi";


export default class BodyCorpetaApi {
  private BodyCoperateDB = collection(db, "BodyCoperate");
  private RecuringInvoiceDB = collection(db, "RecuringInvoices");
  private NEDBANKBB = collection(db, "NedBankStatements");
  private transferDB = collection(db, "Transfer");
  private accountDB = collection(db, "Account");

  body: BodyCopApi;
  // unit: UnitApi;
  financialYear: FinancialYearApi;
  financialMonth: FinancialMonthApi;
  invoice: InvoiceApi;
  recuringInvoice: RecuringInvoiceApi;
  copiedInvoice: CopiedInvoiceApi;
  pop:PopApi;


  supplierInvoice: SupplierInvoiceApi;
  fnb: FNBApi;
  nedbank: NEDBANKApi;
  transfer: TransferApi;
  account: AccountApi;
  supplier: SupplierApi;
  receiptPayments: ReceiptPaymentsApi;
  creditNote: CreditNoteApi;
  supplierReturn: SupplierReturnApi;
  propertyBankAccount: ProperyBankAccountApi;
  accountCategory: AccountCategoryApi;
  banking_transaction: BankingTransactionsApi;
  customer_transactions: CustomerTransactionApi;
  supplier_transactions: SupplierTransactionApi;

  constructor(api: AppApi, store: AppStore) {
    this.body = new BodyCopApi(api, store, this.BodyCoperateDB);
    this.financialYear = new FinancialYearApi(api, store);
    this.financialMonth = new FinancialMonthApi(api, store);
    this.invoice = new InvoiceApi(api, store);
    this.fnb = new FNBApi(api, store);
    this.receiptPayments = new ReceiptPaymentsApi(api, store);
    this.copiedInvoice = new CopiedInvoiceApi(api, store);
    this.supplier = new SupplierApi(api, store);
    this.supplierInvoice = new SupplierInvoiceApi(api, store);
    this.creditNote = new CreditNoteApi(api, store);
    this.propertyBankAccount = new ProperyBankAccountApi(api, store);
    this.supplierReturn = new SupplierReturnApi(api, store);
    this.accountCategory = new AccountCategoryApi(api, store);
    this.banking_transaction = new BankingTransactionsApi(api, store);
    this.customer_transactions = new CustomerTransactionApi(api, store);
    this.supplier_transactions = new SupplierTransactionApi(api, store);
    this.pop = new PopApi(api,store);
    //api needs update
    this.account = new AccountApi(api, store, this.accountDB);
    this.nedbank = new NEDBANKApi(api, store, this.NEDBANKBB);
    this.transfer = new TransferApi(api, store, this.transferDB);
    //   not needed
    this.recuringInvoice = new RecuringInvoiceApi(
      api,
      store,
      this.RecuringInvoiceDB
    );
  }
}
