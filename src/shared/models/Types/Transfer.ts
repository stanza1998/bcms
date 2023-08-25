import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultTransfer: ITransfer = {
  id: "",
  name: "",
  description: "",
};

export interface ITransfer {
  id: string;
  name: string;
  description: string;
}

export default class TransferModel {
  private transfer: ITransfer;

  constructor(private store: AppStore, transfer: ITransfer) {
    makeAutoObservable(this);
    this.transfer = transfer;
  }

  get asJson(): ITransfer {
    return toJS(this.transfer);
  }
}
