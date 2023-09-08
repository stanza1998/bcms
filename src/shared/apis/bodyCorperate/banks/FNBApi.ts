import {
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import AppApi from "../../AppApi";
import AppStore from "../../../stores/AppStore";
import { db } from "../../../database/FirebaseConfig";
import { IFNB } from "../../../models/banks/FNBModel";

export default class FNBApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string, yid: string, mid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months/${mid}/FNBTransactions`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IFNB[] = [];
          querySnapshot.forEach((doc) => {
            items.push({
              id: doc.id,
              ...doc.data(),
            } as IFNB);
          });

          this.store.bodyCorperate.fnb.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getById(id: string, pid: string, yid: string, mid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months/${mid}/FNBTransactions`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IFNB;

      this.store.bodyCorperate.fnb.load([item]);
    });

    return unsubscribe;
  }

  async create(item: IFNB, pid: string, yid: string, mid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months/${mid}/FNBTransactions`;

    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.fnb.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(product: IFNB, pid: string, yid: string, mid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months/${mid}/FNBTransactions`;
    try {
      await updateDoc(doc(db, myPath, product.id), {
        ...product,
      });

      this.store.bodyCorperate.fnb.load([product]);
    } catch (error) {}
  }

  async delete(id: string, pid: string, yid: string, mid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months/${mid}/FNBTransactions`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.fnb.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
