import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../stores/AppStore";

export const defaultAnnouncements: IAnnouncements = {
  id: "",
  title: "",
  dateAndTime: "",
  authorOrSender: "",
  message: "",
  expiryDate: "",
  priorityLevel: "",
};

export interface IAnnouncements {
  id: string;
  title: string;
  dateAndTime: string;
  authorOrSender: string;
  message: string;
  expiryDate: string;
  priorityLevel: string;
}

export default class AnnouncementModel {
  private account: IAnnouncements;

  constructor(private store: AppStore, account: IAnnouncements) {
    makeAutoObservable(this);
    this.account = account;
  }

  get asJson(): IAnnouncements {
    return toJS(this.account);
  }
}
