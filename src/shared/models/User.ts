import { makeAutoObservable } from "mobx";
import AppStore from "../stores/AppStore";
import { IUser } from "../interfaces/IUser";

export class UserModel implements IUser {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
  departmentName: string;
  password?: string | undefined;
  role: string;
  regionId: string;
  region: string;
  devUser: boolean;
  cellphone: number;

  constructor(private store: AppStore, user: IUser) {
    makeAutoObservable(this);
    this.uid = user.uid;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.departmentId = user.departmentId;
    this.departmentName = user.departmentName;
    this.role = user.role;
    this.regionId = user.regionId;
    this.region = user.region;
    this.devUser = user.devUser;
    this.supervisor = user.supervisor;
    this.cellphone = user.cellphone;
  }
  supervisor: string;

  get asJson(): IUser {
    return {
      uid: this.uid,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      departmentId: this.departmentId,
      departmentName: this.departmentName,
      role: this.role,
      regionId: this.regionId,
      region: this.region,
      devUser: this.devUser,
      supervisor: this.supervisor,
      cellphone: this.cellphone,
    };
  }
}
