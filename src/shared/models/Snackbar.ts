import { makeAutoObservable } from "mobx";
import ISnackbar from "../interfaces/ISnackbar";

export class Snackbar implements ISnackbar {
  id: number;
  message: string;
  type: "primary" | "success" | "warning" | "danger" | "default";
  children?: any;
  timeoutInMs?: number | undefined;

  constructor(snackbar: ISnackbar) {
    makeAutoObservable(this);
    this.id = snackbar.id;
    this.message = snackbar.message;
    this.type = snackbar.type;
    this.children = snackbar.children;
    this.timeoutInMs = snackbar.timeoutInMs;
  }

  get asJson() {
    const snackbar: ISnackbar = {
      id: this.id,
      message: this.message,
      type: this.type,
      children: this.children,
      timeoutInMs: this.timeoutInMs,
    };
    return snackbar;
  }
}

export const FailedAction = (ui: any) => {
  return ui.snackbar.load({
    id: Date.now(),
    message: "Error! Failed.",
    type: "danger",
  });
};
export const FailedActionAllFields = (ui: any) => {
  return ui.snackbar.load({
    id: Date.now(),
    message: "Please enter all required fields.",
    type: "danger",
  });
};
export const FailedActionServiceDetail = (ui: any) => {
  return ui.snackbar.load({
    id: Date.now(),
    message: "Services should at least be 1 or more",
    type: "danger",
  });
};

export const SuccessfulAction = (ui: any) => {
  return ui.snackbar.load({
    id: Date.now(),
    message: "Success.",
    type: "success",
  });
};
export const SuccessfullQuotAction = (ui: any) => {
  return ui.snackbar.load({
    id: Date.now(),
    message: "You have successfully uploaded your quote.",
    type: "success",
  });
};
export const SuccessfulActionCustomerReceipt = (ui: any) => {
  return ui.snackbar.load({
    id: Date.now(),
    message: "Cusomer Receipt Created",
    type: "success",
  });
};

export const SuccessfulActionSupplierPayment = (ui: any) => {
  return ui.snackbar.load({
    id: Date.now(),
    message: "Supplier Payments",
    type: "success",
  });
};
