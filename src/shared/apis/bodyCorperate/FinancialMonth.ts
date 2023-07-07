import {
    CollectionReference,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    setDoc,
  } from "firebase/firestore";
import AppApi from "../AppApi";
import AppStore from "../../stores/AppStore";
import { IFinancialMonth } from "../../models/monthModels/FinancialMonth";


  export default class FinancialMonthApi {
    collectionRef: CollectionReference;
    constructor(
      private api: AppApi,
      private store: AppStore,
      collectionRef: CollectionReference
    ) {
      this.collectionRef = collectionRef;
    }
  
    async getAll() {
      const q = query(this.collectionRef);
  
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: IFinancialMonth[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as IFinancialMonth);
        });
  
        this.store.bodyCorperate.financialMonth.load(items);
      });
  
      return unsubscribe;
    }
  
    async getFinancialMonth(id: string) {
      const docSnap = await getDoc(doc(this.collectionRef, id));
      if (docSnap.exists()) {
        const body = { ...docSnap.data(), id: docSnap.id } as IFinancialMonth;
        await this.store.bodyCorperate.financialMonth.load([body]);
        return body;
      } else return undefined;
    }
  
    async create(data: IFinancialMonth) {
      const docRef = doc(this.collectionRef);
      data.id = docRef.id;
      await setDoc(docRef, data, { merge: true });
      return data;
    }
  
    async update(product: IFinancialMonth) {
      await setDoc(doc(this.collectionRef, product.id), product, {
        merge: true,
      });
      return product;
    }
  
    async delete(id: string) {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
      this.store.bodyCorperate.financialMonth.remove(id);
    }
  }
  