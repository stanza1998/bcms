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
import { ITransfer } from "../../../models/Types/Transfer";

  
  export default class TransferApi {
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
        const items: ITransfer[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as ITransfer);
        });
  
        this.store.bodyCorperate.transfer.load(items);
      });
  
      return unsubscribe;
    }
  
    async getBodyCop(id: string) {
      const docSnap = await getDoc(doc(this.collectionRef, id));
      if (docSnap.exists()) {
        const body = { ...docSnap.data(), id: docSnap.id } as ITransfer;
        await this.store.bodyCorperate.transfer.load([body]);
        return body;
      } else return undefined;
    }
  
    async create(data: ITransfer) {
      const docRef = doc(this.collectionRef);
      data.id = docRef.id;
      await setDoc(docRef, data, { merge: true });
      return data;
    }
  
    async update(product: ITransfer) {
      await setDoc(doc(this.collectionRef, product.id), product, {
        merge: true,
      });
      return product;
    }
  
    async delete(id: string) {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
      this.store.bodyCorperate.transfer.remove(id);
    }
  }
  