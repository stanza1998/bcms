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
import { ICopiedInvoice } from "../../../../models/invoices/CopyInvoices";

export default class CopiedInvoiceApi {
  constructor(private api: AppApi, private store: AppStore) { }

  async getAll(pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/CopiedInvoices`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: ICopiedInvoice[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ invoiceId: doc.id, ...doc.data() } as ICopiedInvoice);
          });

          this.store.bodyCorperate.copiedInvoices.load(items);
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
    const myPath = `BodyCoperate/${pid}/CopiedInvoices`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { invoiceId: doc.id, ...doc.data() } as ICopiedInvoice;

      this.store.bodyCorperate.copiedInvoices.load([item]);
    });

    return unsubscribe;
  }

  async create(item: ICopiedInvoice, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/CopiedInvoices`;

    const itemRef = doc(collection(db, myPath));
    item.invoiceId = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.copiedInvoices.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(product: ICopiedInvoice, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/CopiedInvoices`;
    try {
      await updateDoc(doc(db, myPath, product.invoiceId), {
        ...product,
      });

      this.store.bodyCorperate.invoice.load([product]);
    } catch (error) { }
  }

  async delete(id: string, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/CopiedInvoices`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.copiedInvoices.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
