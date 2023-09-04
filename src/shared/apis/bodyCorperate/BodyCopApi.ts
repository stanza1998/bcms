import {
  CollectionReference,
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
import AppApi from "../AppApi";
import AppStore from "../../stores/AppStore";
import { IBodyCop } from "../../models/bcms/BodyCorperate";
import { db } from "../../database/FirebaseConfig";
import { IFNB } from "../../models/banks/FNBModel";

export default class BodyCopApi {
  collectionRef: CollectionReference;
  constructor(
    private api: AppApi,
    private store: AppStore,
    collectionRef: CollectionReference
  ) {
    this.collectionRef = collectionRef;
  }

  async getAll() {
    const q = query(this.collectionRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: IBodyCop[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as IBodyCop);
      });

      this.store.bodyCorperate.bodyCop.load(items);
    });

    return unsubscribe;
  }

  async getBodyCop(id: string) {
    const docSnap = await getDoc(doc(this.collectionRef, id));
    if (docSnap.exists()) {
      const body = { ...docSnap.data(), id: docSnap.id } as IBodyCop;
      await this.store.bodyCorperate.bodyCop.load([body]);
      return body;
    } else return undefined;
  }

  async create(data: IBodyCop) {
    const docRef = doc(this.collectionRef);
    data.id = docRef.id;
    await setDoc(docRef, data, { merge: true });
    return data;
  }

  async update(product: IBodyCop) {
    await setDoc(doc(this.collectionRef, product.id), product, {
      merge: true,
    });
    return product;
  }

  async delete(id: string) {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
    this.store.bodyCorperate.bodyCop.remove(id);
  }

  async getTransactionsForYear(propertyId: string, financialYear: string) {
    try {
      const bodyCoperateCollectionRef = collection(db, "BodyCoperate");

      // Reference to the specific document in "BodyCoperate"
      const bodyCoperateDocRef = doc(bodyCoperateCollectionRef, propertyId);

      // Reference to the "Year" subcollection under the specific document
      const yearCollectionRef = collection(bodyCoperateDocRef, "Year");

      // Reference to the specific year document
      const yearDocRef = doc(yearCollectionRef, financialYear);

      // Reference to the "Transactions" subcollection under the specific year document
      const transactionsCollectionRef = collection(yearDocRef, "Transactions");

      // Query the transactions
      const transactionsQuerySnapshot = await getDocs(
        transactionsCollectionRef
      );

      const transactions = transactionsQuerySnapshot.docs.map((doc) => {
        return doc.data() as IFNB;
      });

      console.log("🚀  transactions:", transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }

  async setActiveStatus(documentId: string, active: boolean) {
    try {
      // Reference to the collection of documents
      const documentsCollectionRef = this.collectionRef;

      // Find the document with the current active status set to true
      const activeDocumentQuery = query(
        documentsCollectionRef,
        where("active", "==", true)
      );

      const activeDocumentQuerySnapshot = await getDocs(
        activeDocumentQuery
      );

      if (activeDocumentQuerySnapshot.size > 0) {
        // There is an active document, so update it to false
        const activeDocument = activeDocumentQuerySnapshot.docs[0];
        const activeDocumentRef = doc(documentsCollectionRef, activeDocument.id);
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
