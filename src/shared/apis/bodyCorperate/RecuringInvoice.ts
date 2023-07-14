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
import { IRecuringInvoice } from "../../models/invoices/RecuringInvoices";

export default class RecuringInvoiceApi {
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
      const items: IRecuringInvoice[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ invoiceId: doc.id, ...doc.data() } as IRecuringInvoice);
      });

      this.store.bodyCorperate.recuringInvoice.load(items);
    });

    return unsubscribe;
  }

  async getRecuringInvoice(id: string) {
    const docSnap = await getDoc(doc(this.collectionRef, id));
    if (docSnap.exists()) {
      const body = {
        ...docSnap.data(),
        invoiceId: docSnap.id,
      } as IRecuringInvoice;
      await this.store.bodyCorperate.recuringInvoice.load([body]);
      return body;
    } else return undefined;
  }

  async create(data: IRecuringInvoice) {
    const docRef = doc(this.collectionRef);
    data.invoiceId = docRef.id;
    await setDoc(docRef, data, { merge: true });
    return data;
  }

  async update(invoice: IRecuringInvoice) {
    await setDoc(doc(this.collectionRef, invoice.invoiceId), invoice, {
      merge: true,
    });
    return invoice;
  }

  async delete(id: string) {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
    this.store.bodyCorperate.recuringInvoice.remove(id);
  }
}
