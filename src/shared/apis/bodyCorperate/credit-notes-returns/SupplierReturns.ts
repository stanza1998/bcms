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
import { ISupplierReturns } from "../../../models/credit-notes-returns/SupplierReturns";

export default class SupplierReturnApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string, yid: string, mid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months/${mid}/SupplierReturns`;
    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: ISupplierReturns[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as ISupplierReturns);
          });

          this.store.bodyCorperate.supplierReturn.load(items);
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
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months/${mid}/SupplierReturns`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as ISupplierReturns;
      this.store.bodyCorperate.supplierReturn.load([item]);
    });
    return unsubscribe;
  }

  //   async create(item: ISupplierReturns, pid: string, yid: string, mid: string) {
  //     const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months/${mid}/SupplierReturns`;
  //     const itemRef = doc(collection(db, myPath));
  //     item.id = itemRef.id;

  //     // create in db
  //     try {
  //       await setDoc(itemRef, item, {
  //         merge: true,
  //       });
  //       // create in store
  //       this.store.bodyCorperate.supplierReturn.load([item]);
  //     } catch (error) {
  //       // console.log(error);
  //     }
  //   }

  async create(
    item: ISupplierReturns,
    pid: string,
    yid: string,
    mid: string,
    supplierId: string
  ) {
    try {
      const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months/${mid}/SupplierReturns`;
      const itemRef = doc(collection(db, myPath));
      item.id = itemRef.id;

      // Create in db
      await setDoc(itemRef, item, { merge: true });

      // Retrieve unit document
      const supplierDocRef = doc(
        db,
        `BodyCoperate/${pid}/Suppliers/${supplierId}`
      );
      const supplierDocSnap = await getDoc(supplierDocRef);

      if (supplierDocSnap.exists()) {
        const suppliertData = supplierDocSnap.data();
        const newUnitBalance = suppliertData.balance - item.balance;

        // Update unit document with new unit balance
        await setDoc(
          supplierDocRef,
          { balance: newUnitBalance },
          { merge: true }
        );

        // Create in store
        this.store.bodyCorperate.supplierReturn.load([item]);
      } else {
        // Handle case where unit document is not found
        console.error(`Unit document with ID ${supplierId} not found.`);
      }
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  }

  async update(
    product: ISupplierReturns,
    pid: string,
    yid: string,
    mid: string
  ) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months/${mid}/SupplierReturns`;
    try {
      await updateDoc(doc(db, myPath, product.id), {
        ...product,
      });

      this.store.bodyCorperate.supplierReturn.load([product]);
    } catch (error) {}
  }

  async delete(id: string, pid: string, yid: string, mid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months/${mid}/SupplierReturns`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.supplierReturn.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
