import { makeAutoObservable } from "mobx";
import IDepartment from "../interfaces/IDepartment";
import AppStore from "../stores/AppStore";

export class Department implements IDepartment {
  id: string;
  name: string;

  constructor(private store: AppStore, department: IDepartment) {
    makeAutoObservable(this);
    this.id = department.id;
    this.name = department.name;
  }

  get asJson(): IDepartment {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
