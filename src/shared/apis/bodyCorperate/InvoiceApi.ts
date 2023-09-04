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
import AppApi from "../AppApi";
import AppStore from "../../stores/AppStore";
import { IInvoice } from "../../models/invoices/Invoices";
import { db } from "../../database/FirebaseConfig";

export default class InvoiceApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll() {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/FinancialYear/oW6F7LmwBv862NurrPox/Months/2023-08/MasterInvoices`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IInvoice[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ invoiceId: doc.id, ...doc.data() } as IInvoice);
          });

          this.store.bodyCorperate.invoice.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getById(id: string) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/FinancialYear/oW6F7LmwBv862NurrPox/Months/2023-08/MasterInvoices`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { invoiceId: doc.id, ...doc.data() } as IInvoice;

      this.store.bodyCorperate.invoice.load([item]);
    });

    return unsubscribe;
  }

  async create(item: IInvoice) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/FinancialYear/oW6F7LmwBv862NurrPox/Months/2023-08/MasterInvoices`;

    const itemRef = doc(collection(db, myPath));
    item.invoiceId = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.invoice.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(product: IInvoice) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/FinancialYear/oW6F7LmwBv862NurrPox/Months/2023-08/MasterInvoices`;
    try {
      await updateDoc(doc(db, myPath, product.invoiceId), {
        ...product,
      });

      this.store.bodyCorperate.invoice.load([product]);
    } catch (error) {}
  }

  async delete(id: string) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/FinancialYear/oW6F7LmwBv862NurrPox/Months/2023-08/MasterInvoices`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.invoice.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
