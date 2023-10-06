import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../stores/AppStore";

export const defaultPrivateMessage: IPrivateMessage = {
  id: "",
  receiver: "",
  sender: "",
  message: "",
  dateAndTime: null,
};

export interface IPrivateMessage {
  id: string;
  receiver: string;
  sender: string;
  message: string;
  dateAndTime: number | null;
}

export default class PrivateMessagetModel {
  private message: IPrivateMessage;

  constructor(private store: AppStore, message: IPrivateMessage) {
    makeAutoObservable(this);
    this.message = message;
  }

  get asJson(): IPrivateMessage {
    return toJS(this.message);
  }
}
