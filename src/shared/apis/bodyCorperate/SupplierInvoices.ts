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
import AppApi from "../AppApi";
import AppStore from "../../stores/AppStore";
import { db } from "../../database/FirebaseConfig";
import { ISupplierInvoices } from "../../models/invoices/SupplierInvoice";

export default class SupplierInvoiceApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll() {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/FinancialYear/oW6F7LmwBv862NurrPox/Months/2023-08/SupplierInvoices`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: ISupplierInvoices[] = [];
          querySnapshot.forEach((doc) => {
            items.push({
              invoiceId: doc.id,
              ...doc.data(),
            } as ISupplierInvoices);
          });

          this.store.bodyCorperate.supplierInvoice.load(items);
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
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/FinancialYear/oW6F7LmwBv862NurrPox/Months/2023-08/SupplierInvoices`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { invoiceId: doc.id, ...doc.data() } as ISupplierInvoices;

      this.store.bodyCorperate.supplierInvoice.load([item]);
    });

    return unsubscribe;
  }

  async create(item: ISupplierInvoices) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/FinancialYear/oW6F7LmwBv862NurrPox/Months/2023-08/SupplierInvoices`;

    const itemRef = doc(collection(db, myPath));
    item.invoiceId = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.supplierInvoice.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(product: ISupplierInvoices) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/FinancialYear/oW6F7LmwBv862NurrPox/Months/2023-08/SupplierInvoices`;
    try {
      await updateDoc(doc(db, myPath, product.invoiceId), {
        ...product,
      });

      this.store.bodyCorperate.supplierInvoice.load([product]);
    } catch (error) {}
  }

  async delete(id: string) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/FinancialYear/oW6F7LmwBv862NurrPox/Months/2023-08/SupplierInvoices`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.supplierInvoice.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
