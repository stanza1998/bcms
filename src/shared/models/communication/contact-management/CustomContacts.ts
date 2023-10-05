import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../stores/AppStore";

export const defaultCustomContacts: ICustomContact = {
  id: "",
  name: "",
  email: "",
  cellTell: "",
  cityTown: "",
  location: "",
};

export interface ICustomContact {
  id: string;
  name: string;
  email: string;
  cellTell: string;
  cityTown: string;
  location: string;
}

export default class CustomContactModel {
  private custom_contact: ICustomContact;

  constructor(private store: AppStore, custom_contact: ICustomContact) {
    makeAutoObservable(this);
    this.custom_contact = custom_contact;
  }

  get asJson(): ICustomContact {
    return toJS(this.custom_contact);
  }
}
