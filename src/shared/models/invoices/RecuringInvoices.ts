import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export interface IService {
  description: string;
  price: number;
}
export interface IPOP {
  pop: string;
  confirmed: boolean;
  date: string;
  deletable: true;
}

export interface IPaymentDates {
  paymentDates: string;
  decription: string;
}

export interface IRecuringInvoice {
  invoiceId: string;
  propertyId: string;
  unitId: string;
  invoiceNumber: string;
  dateIssued: string;
  totalPayment: number;
  services: IService[];
  pop: IPOP[];
  verified: boolean;
  terminate: boolean;
  dayOfMonth: number;
}

export const defaultRecuringInvoice: IRecuringInvoice = {
  invoiceId: "",
  propertyId: "",
  unitId: "",
  invoiceNumber: "",
  dateIssued: "",
  totalPayment: 0,
  services: [],
  pop: [],

  verified: false,
  terminate: false,
  dayOfMonth: 0,
};

export default class RecuringInvoiceModel {
  private invoice: IRecuringInvoice;

  constructor(private store: AppStore, invoice: IRecuringInvoice) {
    makeAutoObservable(this);
    this.invoice = invoice;
  }

  get asJson(): IRecuringInvoice {
    return toJS(this.invoice);
  }
}
