import {
    CollectionReference,
    Unsubscribe,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import AppApi from "../../AppApi";
  import AppStore from "../../../stores/AppStore";
  import { db } from "../../../database/FirebaseConfig";
import { IPop } from "../../../models/proof-of-payment/PopModel";
  
  export default class PopApi {
    constructor(private api: AppApi, private store: AppStore) {}
  
    async getAll(pid: string, yid:string) {
      const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}`;
  
      const $query = query(collection(db, myPath));
      // new promise
      return await new Promise<Unsubscribe>((resolve, reject) => {
        // on snapshot
        const unsubscribe = onSnapshot(
          $query,
          // onNext
          (querySnapshot) => {
            const items: IPop[] = [];
            querySnapshot.forEach((doc) => {
              items.push({ popId: doc.id, ...doc.data() } as IPop);
            });
  
            this.store.bodyCorperate.pop.load(items);
            resolve(unsubscribe);
          },
          // onError
          (error) => {
            reject();
          }
        );
      });
    }
  
    async getById(id: string, pid: string,yid:string) {
      const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}`;
  
      const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
        if (!doc.exists) return;
        const item = { popId: doc.id, ...doc.data() } as IPop;
  
        this.store.bodyCorperate.pop.load([item]);
      });
  
      return unsubscribe;
    }
  
    //rememberId
    async create(item: IPop, pid: string, yid:string) {
      const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}`;
  
      const itemRef = doc(collection(db, myPath));
      item.popId = itemRef.id;
  
      // create in db
      try {
        await setDoc(itemRef, item, {
          merge: true,
        });
        // create in store
        this.store.bodyCorperate.pop.load([item]);
      } catch (error) {
        // console.log(error);
      }
    }
    async update(pop: IPop, pid: string, yid:string) {
      const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}`;
      try {
        await updateDoc(doc(db, myPath, pop.popId), {
          ...pop,
        });
  
        this.store.bodyCorperate.pop.load([pop]);
      } catch (error) {}
    }
  
    async delete(id: string, pid: string,yid:string) {
      const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}`;
      try {
        await deleteDoc(doc(db, myPath, id));
        this.store.bodyCorperate.pop.remove(id);
      } catch (error) {
        console.log(error);
      }
    }
    
  }
  