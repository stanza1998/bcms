import {
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import AppApi from "../AppApi";
import AppStore from "../../stores/AppStore";
import { ISupplierInvoices } from "../../models/invoices/SupplierInvoice";

export default class SupplierInvoiceApi {
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
      const items: ISupplierInvoices[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ invoiceId: doc.id, ...doc.data() } as ISupplierInvoices);
      });

      this.store.bodyCorperate.supplierInvoice.load(items);
    });

    return unsubscribe;
  }

  async getInvoice(id: string) {
    const docSnap = await getDoc(doc(this.collectionRef, id));
    if (docSnap.exists()) {
      const body = {
        ...docSnap.data(),
        invoiceId: docSnap.id,
      } as ISupplierInvoices;
      await this.store.bodyCorperate.supplierInvoice.load([body]);
      return body;
    } else return undefined;
  }

  async create(data: ISupplierInvoices) {
    const docRef = doc(this.collectionRef);
    data.invoiceId = docRef.id;
    await setDoc(docRef, data, { merge: true });
    return data;
  }

  async update(invoice: ISupplierInvoices) {
    await setDoc(doc(this.collectionRef, invoice.invoiceId), invoice, {
      merge: true,
    });
    return invoice;
  }

  async delete(id: string) {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
    this.store.bodyCorperate.supplierInvoice.remove(id);
  }
}
