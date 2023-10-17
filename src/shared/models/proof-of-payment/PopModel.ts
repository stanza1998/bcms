import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";


export const defaultPop: IPop ={
    popId:"",
    invoiceId:"",
    date:"",
    url:"",
};

export interface IPop{
    popId:string;
    invoiceId:string,
    date:string,
    url:string,
}

export default class Pop {
    private pop: IPop;
  
    constructor(private store: AppStore, pop: IPop) {
      makeAutoObservable(this);
      this.pop = pop;
    }
  
    get asJson(): IPop {
      return toJS(this.pop);
    }
  }
