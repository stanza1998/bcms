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
import AppApi from "../../../AppApi";
import AppStore from "../../../../stores/AppStore";
import { db } from "../../../../database/FirebaseConfig";
import { ICustomerTransactions } from "../../../../models/transactions/customer-transactions/CustomerTransactionModel";

export default class CustomerTransactionApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/CustomerTransactions`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: ICustomerTransactions[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as ICustomerTransactions);
          });

          this.store.bodyCorperate.customerTransactions.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getById(id: string, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/CustomerTransactions`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as ICustomerTransactions;

      this.store.bodyCorperate.customerTransactions.load([item]);
    });

    return unsubscribe;
  }

  async create(item: ICustomerTransactions, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/CustomerTransactions`;

    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.customerTransactions.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(product: ICustomerTransactions, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/CustomerTransactions`;
    try {
      await updateDoc(doc(db, myPath, product.id), {
        ...product,
      });

      this.store.bodyCorperate.customerTransactions.load([product]);
    } catch (error) {}
  }

  async delete(id: string, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/CustomerTransactions`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.customerTransactions.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
