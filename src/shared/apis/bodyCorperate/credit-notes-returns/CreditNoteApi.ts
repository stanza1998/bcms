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
import { ICreditNote } from "../../../models/credit-notes-returns/CreditNotesReturns";

export default class CreditNoteApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string, yid: string, mid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/CreditNotes`;
    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: ICreditNote[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as ICreditNote);
          });

          this.store.bodyCorperate.creditNote.load(items);
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
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/CreditNotes`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as ICreditNote;
      this.store.bodyCorperate.creditNote.load([item]);
    });
    return unsubscribe;
  }

  //   async create(item: ICreditNote, pid: string, yid: string, mid: string) {
  //     const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/CreditNotes`;
  //     const itemRef = doc(collection(db, myPath));
  //     item.id = itemRef.id;

  //     // create in db
  //     try {
  //       await setDoc(itemRef, item, {
  //         merge: true,
  //       });
  //       // create in store
  //       this.store.bodyCorperate.creditNote.load([item]);
  //     } catch (error) {
  //       // console.log(error);
  //     }
  //   }

  async create(
    item: ICreditNote,
    pid: string,
    yid: string,
    mid: string,
    unitId: string
  ) {
    try {
      const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/CreditNotes`;
      const itemRef = doc(collection(db, myPath));
      item.id = itemRef.id;

      // Create in db
      await setDoc(itemRef, item, { merge: true });

      // Retrieve unit document
      const unitDocRef = doc(db, `BodyCoperate/${pid}/Units/${unitId}`);
      const unitDocSnap = await getDoc(unitDocRef);

      if (unitDocSnap.exists()) {
        const unitData = unitDocSnap.data();
        const newUnitBalance = unitData.balance - item.balance;

        // Update unit document with new unit balance
        await setDoc(unitDocRef, { balance: newUnitBalance }, { merge: true });

        // Create in store
        this.store.bodyCorperate.creditNote.load([item]);
      } else {
        // Handle case where unit document is not found
        console.error(`Unit document with ID ${unitId} not found.`);
      }
    } catch (error) {
      // Handle errors
      console.error(error);
    }
  }

  async update(product: ICreditNote, pid: string, yid: string, mid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/CreditNotes`;
    try {
      await updateDoc(doc(db, myPath, product.id), {
        ...product,
      });

      this.store.bodyCorperate.creditNote.load([product]);
    } catch (error) {}
  }

  async delete(id: string, pid: string, yid: string, mid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/CreditNotes`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.creditNote.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
