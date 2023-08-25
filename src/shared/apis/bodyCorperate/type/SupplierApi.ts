import {
    CollectionReference,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    setDoc,
  } from "firebase/firestore";
import AppApi from "../../AppApi";
import AppStore from "../../../stores/AppStore";
import { ISupplier } from "../../../models/Types/Suppliers";


  
  export default class SupplierApi {
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
        const items: ISupplier[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as ISupplier);
        });
  
        this.store.bodyCorperate.supplier.load(items);
      });
  
      return unsubscribe;
    }
  
    async getBodyCop(id: string) {
      const docSnap = await getDoc(doc(this.collectionRef, id));
      if (docSnap.exists()) {
        const body = { ...docSnap.data(), id: docSnap.id } as ISupplier;
        await this.store.bodyCorperate.supplier.load([body]);
        return body;
      } else return undefined;
    }
  
    async create(data: ISupplier) {
      const docRef = doc(this.collectionRef);
      data.id = docRef.id;
      await setDoc(docRef, data, { merge: true });
      return data;
    }
  
    async update(product: ISupplier) {
      await setDoc(doc(this.collectionRef, product.id), product, {
        merge: true,
      });
      return product;
    }
  
    async delete(id: string) {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
      this.store.bodyCorperate.supplier.remove(id);
    }
  }
  