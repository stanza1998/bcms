import AppStore from "../AppStore";
import FinancialMonthStore from "../individualStore/months/FinancialMonth";
import BodyCopStore from "../individualStore/properties/BodyCopStore";
import UnitStore from "../individualStore/properties/UnitStore";
import FinancialYearStore from "../individualStore/years/FinancialYear";

export default class BodyCorporateStore {
  bodyCop: BodyCopStore;
  unit: UnitStore;
  financialYear: FinancialYearStore;
  financialMonth: FinancialMonthStore;

  constructor(store: AppStore) {
    this.bodyCop = new BodyCopStore(store);
    this.unit = new UnitStore(store);
    this.financialYear = new FinancialYearStore(store);
    this.financialMonth = new FinancialMonthStore(store);
  }
}
