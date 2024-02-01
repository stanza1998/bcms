import {
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import AppApi from "../../AppApi";
import AppStore from "../../../stores/AppStore";
import { db } from "../../../database/FirebaseConfig";
import { IReceiptsPayments } from "../../../models/receipts-payments/ReceiptsPayments";

export default class ReceiptPaymentsApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/ReceiptsPayments`;
    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IReceiptsPayments[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IReceiptsPayments);
          });

          this.store.bodyCorperate.receiptsPayments.load(items);
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
    const myPath = `BodyCoperate/${pid}/ReceiptsPayments`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IReceiptsPayments;
      this.store.bodyCorperate.receiptsPayments.load([item]);
    });
    return unsubscribe;
  }

  async create(item: IReceiptsPayments, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/ReceiptsPayments`;
    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.receiptsPayments.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(
    product: IReceiptsPayments,
    pid: string,
    yid: string,
    mid: string
  ) {
    const myPath = `BodyCoperate/${pid}/ReceiptsPayments`;
    try {
      await updateDoc(doc(db, myPath, product.id), {
        ...product,
      });

      this.store.bodyCorperate.receiptsPayments.load([product]);
    } catch (error) {}
  }

  async delete(id: string, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/ReceiptsPayments`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.receiptsPayments.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
