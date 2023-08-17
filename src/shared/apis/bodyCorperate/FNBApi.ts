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
import { IFNB } from "../../models/banks/FNBModel";

export default class FNBApi {
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
      const items: IFNB[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as IFNB);
      });

      this.store.bodyCorperate.fnb.load(items);
    });

    return unsubscribe;
  }

  async getFNB(id: string) {
    const docSnap = await getDoc(doc(this.collectionRef, id));
    if (docSnap.exists()) {
      const body = { ...docSnap.data(), id: docSnap.id } as IFNB;
      await this.store.bodyCorperate.fnb.load([body]);
      return body;
    } else return undefined;
  }

  async create(data: IFNB) {
    const docRef = doc(this.collectionRef);
    data.id = docRef.id;
    await setDoc(docRef, data, { merge: true });
    return data;
  }

  async update(unit: IFNB) {
    await setDoc(doc(this.collectionRef, unit.id), unit, {
      merge: true,
    });
    return unit;
  }

  async delete(id: string) {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
    this.store.bodyCorperate.fnb.remove(id);
  }
}
