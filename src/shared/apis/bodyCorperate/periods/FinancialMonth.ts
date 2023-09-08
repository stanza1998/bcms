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
import { IFinancialMonth } from "../../../models/monthModels/FinancialMonth";
import { db } from "../../../database/FirebaseConfig";

export default class FinancialMonthApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IFinancialMonth[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ month: doc.id, ...doc.data() } as IFinancialMonth);
          });

          this.store.bodyCorperate.financialMonth.load(items);
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
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IFinancialMonth;

      this.store.bodyCorperate.financialMonth.load([item]);
    });

    return unsubscribe;
  }

  async create(item: IFinancialMonth, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months/${item.month}`;

    const itemRef = doc(db, myPath);

    try {
      // Check if the document already exists
      const docSnapshot = await getDoc(itemRef);

      if (docSnapshot.exists()) {
        // Document already exists, you can handle this case here if needed
      } else {
        // Document doesn't exist, create it
        await setDoc(itemRef, item, {
          merge: true,
        });

        // Create in store
        this.store.bodyCorperate.financialMonth.load([item]);
      }
    } catch (error) {
      console.error("Error creating document:", error);
    }
  }

  async update(product: IFinancialMonth, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months`;
    try {
      await updateDoc(doc(db, myPath, product.month), {
        ...product,
      });

      this.store.bodyCorperate.financialMonth.load([product]);
    } catch (error) {}
  }

  async delete(id: string, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/Months`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.financialMonth.remove(id);
    } catch (error) {
      console.log(error);
    }
  }

  async setActiveStatus(documentId: string, active: boolean) {
    try {
      const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/FinancialYear/oW6F7LmwBv862NurrPox/Months`;

      // Reference to the collection of documents
      const documentsCollectionRef = collection(db, myPath);

      // Find the document with the current active status set to true
      const activeDocumentQuery = query(
        documentsCollectionRef,
        where("active", "==", true)
      );

      const activeDocumentQuerySnapshot = await getDocs(activeDocumentQuery);

      if (activeDocumentQuerySnapshot.size > 0) {
        // There is an active document, so update it to false
        const activeDocument = activeDocumentQuerySnapshot.docs[0];
        const activeDocumentRef = doc(
          documentsCollectionRef,
          activeDocument.id
        );
        await updateDoc(activeDocumentRef, { active: false });
      }

      // Update the desired document to the new active status
      const desiredDocumentRef = doc(documentsCollectionRef, documentId);
      await updateDoc(desiredDocumentRef, { active });

      return true; // Success
    } catch (error) {
      console.error("Error updating active status:", error);
      return false; // Error
    }
  }
}
