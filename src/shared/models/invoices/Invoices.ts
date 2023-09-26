import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultInvoice: IInvoice = {
  invoiceId: "",
  propertyId: "",
  unitId: "",
  yearId: "",
  monthId: "",
  invoiceNumber: "",
  dateIssued: "",
  dueDate: "",
  references: "",
  totalDue: 0,
  serviceId: [],
  pop: "",
  confirmed: false,
  verified: false,
  reminder: false,
  reminderDate: "",
  totalPaid: 0,
  vat: false,
  priceBeforeTax: 0,
  vatPrice: 0,
};

export interface IService {
  description: string;
  price: number;
}

export interface IInvoice {
  invoiceId: string;
  propertyId: string;
  unitId: string;
  yearId: string;
  monthId: string;
  invoiceNumber: string;
  dateIssued: string;
  dueDate: string;
  references: string;
  totalDue: number;
  serviceId: IService[];
  pop: string;
  confirmed: boolean;
  verified: boolean;
  reminder: false;
  reminderDate: string;
  totalPaid: number;
  vat: boolean;
  priceBeforeTax: number;
  vatPrice: number;
}

export default class InvoiceModel {
  private invoice: IInvoice;

  constructor(private store: AppStore, invoice: IInvoice) {
    makeAutoObservable(this);
    this.invoice = invoice;
  }

  get asJson(): IInvoice {
    return toJS(this.invoice);
  }
}
