import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultSupplierInvoices: ISupplierInvoices = {
  invoiceId: "",
  yearId: "",
  invoiceNumber: "",
  dateIssued: "",
  dueDate: "",
  references: "",
  totalDue: 0,
  serviceId: [],
  confirmed: false,
  verified: false,
  reminder: false,
  reminderDate: "",
  totalPaid: 0,
  propertyId: "",
  supplierId: ""
};

export interface IService {
  description: string;
  qty: number;
  price: number;
}

export interface ISupplierInvoices {
  invoiceId: string;
  yearId: string;
  invoiceNumber: string;
  dateIssued: string;
  dueDate: string;
  references: string;
  totalDue: number;
  serviceId: IService[];
  confirmed: boolean;
  verified: boolean;
  reminder: false;
  reminderDate: string;
  totalPaid: number;
  propertyId:string;
  supplierId:string;
}


export default class SupplierInvoicesModel {
  private invoice: ISupplierInvoices;

  constructor(private store: AppStore, invoice: ISupplierInvoices) {
    makeAutoObservable(this);
    this.invoice = invoice;
  }

  get asJson(): ISupplierInvoices {
    return toJS(this.invoice);
  }
}
