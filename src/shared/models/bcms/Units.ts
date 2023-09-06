import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultUnit: IUnit = {
    id: "",
    unitName: 0,
    bodyCopId: "",
    ownerId: "",
    balance:0
};

export interface IUnit {
  id: string;
  unitName: number;
  bodyCopId: string;
  ownerId: string;
  balance:number;
}

export default class UnitModel {
  private unit: IUnit;

  constructor(private store: AppStore, unit: IUnit) {
    makeAutoObservable(this);
    this.unit = unit;
  }

  get asJson(): IUnit {
    return toJS(this.unit);
  }
}
