import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultCreditNote: ICreditNote = {
  id: "",
  unitId: "",
  balance: 0,
  invoiceNumber: "",
  customerReference: "",
};

export interface ICreditNote {
  id: string;
  unitId: string;
  balance: number;
  invoiceNumber: string | "";
  customerReference: string | "";
}

export default class CreditNoteModel {
  private creditNote: ICreditNote;

  constructor(private store: AppStore, creditNote: ICreditNote) {
    makeAutoObservable(this);
    this.creditNote = creditNote;
  }

  get asJson(): ICreditNote {
    return toJS(this.creditNote);
  }
}
