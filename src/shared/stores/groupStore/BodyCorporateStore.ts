import AppStore from "../AppStore";
import BodyCopStore from "../individualStore/BodyCopStore";
import UnitStore from "../individualStore/UnitStore";

export default class BodyCorporateStore {
  bodyCop: BodyCopStore;
  unit: UnitStore;

  constructor(store: AppStore) {
    this.bodyCop = new BodyCopStore(store);
    this.unit = new UnitStore(store);
  }
}
