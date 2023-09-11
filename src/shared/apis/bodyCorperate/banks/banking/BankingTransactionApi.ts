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
import { IBankingTransactions } from "../../../../models/banks/banking/BankTransactions";

export default class BankingTransactionsApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string, aid: string) {
    const myPath = `BodyCoperate/${pid}/BankAccount/${aid}/BankingTransactions`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IBankingTransactions[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IBankingTransactions);
          });

          this.store.bodyCorperate.bankingTransactions.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getById(id: string, pid: string, aid: string) {
    const myPath = `BodyCoperate/${pid}/BankAccount/${aid}/BankingTransactions`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IBankingTransactions;

      this.store.bodyCorperate.bankingTransactions.load([item]);
    });

    return unsubscribe;
  }

  async create(item: IBankingTransactions, pid: string, aid: string) {
    const myPath = `BodyCoperate/${pid}/BankAccount/${aid}/BankingTransactions`;

    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.bankingTransactions.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(product: IBankingTransactions, pid: string, aid: string) {
    const myPath = `BodyCoperate/${pid}/BankAccount/${aid}/BankingTransactions`;
    try {
      await updateDoc(doc(db, myPath, product.id), {
        ...product,
      });

      this.store.bodyCorperate.bankingTransactions.load([product]);
    } catch (error) {}
  }

  async delete(id: string, pid: string, aid: string) {
    const myPath = `BodyCoperate/${pid}/BankAccount/${aid}/BankingTransactions`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.bankingTransactions.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
