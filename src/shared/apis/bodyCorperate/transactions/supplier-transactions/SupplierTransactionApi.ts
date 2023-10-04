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
import { ISupplierTransactions } from "../../../../models/transactions/supplier-transactions/SupplierTransactions";

export default class SupplierTransactionApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/SupplierTransactions`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: ISupplierTransactions[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as ISupplierTransactions);
          });

          this.store.bodyCorperate.supplierTransactions.load(items);
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
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/SupplierTransactions`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as ISupplierTransactions;

      this.store.bodyCorperate.supplierTransactions.load([item]);
    });

    return unsubscribe;
  }

  // async create(item: ISupplierTransactions, pid: string, yid: string) {
  //   const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/SupplierTransactions`;

  //   const itemRef = doc(collection(db, myPath));
  //   // item.id = itemRef.id;

  //   // create in db
  //   try {
  //     await setDoc(itemRef, item, {
  //       merge: true,
  //     });
  //     // create in store
  //     this.store.bodyCorperate.supplierTransactions.load([item]);
  //   } catch (error) {
  //     // console.log(error);
  //   }
  // }
  // async create(
  //   item: ISupplierTransactions,
  //   pid: string,
  //   yid: string,
  //   customId: string
  // ) {
  //   const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/SupplierTransactions`;

  //   const itemRef = doc(db, myPath, customId); // Use customId as the document ID

  //   // create in db
  //   try {
  //     await setDoc(itemRef, item, {
  //       merge: true,
  //     });
  //     // create in store
  //     this.store.bodyCorperate.supplierTransactions.load([item]);
  //   } catch (error) {
  //     // Handle error
  //   }
  // }

  async create(
    item: ISupplierTransactions,
    pid: string,
    yid: string,
    customId?: string
  ) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/SupplierTransactions`;

    let itemRef;

    if (customId && customId.trim() !== "") {
      itemRef = doc(db, myPath, customId);
    } else {
      itemRef = doc(collection(db, myPath));
      item.id = itemRef.id;
    }

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.supplierTransactions.load([item]);
    } catch (error) {
      // Handle error
    }
  }

  async update(product: ISupplierTransactions, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/SupplierTransactions`;
    try {
      await updateDoc(doc(db, myPath, product.id), {
        ...product,
      });

      this.store.bodyCorperate.supplierTransactions.load([product]);
    } catch (error) {}
  }

  async delete(id: string, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/SupplierTransactions`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.supplierTransactions.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
