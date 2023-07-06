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
import { IBodyCop } from "../../models/bcms/BodyCorperate";
  

  
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
  }
  