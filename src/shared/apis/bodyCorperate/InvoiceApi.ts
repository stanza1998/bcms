import {
    CollectionReference,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    setDoc,
  } from "firebase/firestore";
import AppApi from "../AppApi";
import AppStore from "../../stores/AppStore";
import { IInvoice } from "../../models/invoices/Invoices";

  export default class InvoiceApi {
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
        const items: IInvoice[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ invoiceId: doc.id, ...doc.data() } as IInvoice);
        });
  
        this.store.bodyCorperate.invoice.load(items);
      });
  
      return unsubscribe;
    }
  
    async getInvoice(id: string) {
      const docSnap = await getDoc(doc(this.collectionRef, id));
      if (docSnap.exists()) {
        const body = { ...docSnap.data(), invoiceId: docSnap.id } as IInvoice;
        await this.store.bodyCorperate.invoice.load([body]);
        return body;
      } else return undefined;
    }
  
    async create(data: IInvoice) {
      const docRef = doc(this.collectionRef);
      data.invoiceId = docRef.id;
      await setDoc(docRef, data, { merge: true });
      return data;
    }
  
    async update(invoice: IInvoice) {
      await setDoc(doc(this.collectionRef, invoice.invoiceId), invoice, {
        merge: true,
      });
      return invoice;
    }
  
    async delete(id: string) {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
      this.store.bodyCorperate.invoice.remove(id);
    }
  }
  