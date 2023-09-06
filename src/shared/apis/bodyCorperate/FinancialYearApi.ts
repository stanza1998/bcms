import {
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import AppApi from "../AppApi";
import AppStore from "../../stores/AppStore";
import { IFinancialYear } from "../../models/yearModels/FinancialYear";
import { db } from "../../database/FirebaseConfig";

export default class FinancialYearApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IFinancialYear[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IFinancialYear);
          });

          this.store.bodyCorperate.financialYear.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getById(id: string, pid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IFinancialYear;

      this.store.bodyCorperate.financialYear.load([item]);
    });

    return unsubscribe;
  }

  async create(item: IFinancialYear, pid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear`;

    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.financialYear.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(product: IFinancialYear, pid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear`;
    try {
      await updateDoc(doc(db, myPath, product.id), {
        ...product,
      });

      this.store.bodyCorperate.financialYear.load([product]);
    } catch (error) {}
  }

  async delete(id: string, pid: string) {
    const myPath = `BodyCoperate/${pid}/FinancialYear`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.financialYear.remove(id);
    } catch (error) {
      console.log(error);
    }
  }

  async setActiveStatus(documentId: string, active: boolean) {
    try {
      const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/FinancialYear`;

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
