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
import { INEDBANK } from "../../models/banks/NEDBANK";

export default class NEDBANKApi {
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
      const items: INEDBANK[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as INEDBANK);
      });

      this.store.bodyCorperate.nedbank.load(items);
    });

    return unsubscribe;
  }

  async getFNB(id: string) {
    const docSnap = await getDoc(doc(this.collectionRef, id));
    if (docSnap.exists()) {
      const body = { ...docSnap.data(), id: docSnap.id } as INEDBANK;
      await this.store.bodyCorperate.nedbank.load([body]);
      return body;
    } else return undefined;
  }

  async create(data: INEDBANK) {
    const docRef = doc(this.collectionRef);
    data.id = docRef.id;
    await setDoc(docRef, data, { merge: true });
    return data;
  }

  async update(unit: INEDBANK) {
    await setDoc(doc(this.collectionRef, unit.id), unit, {
      merge: true,
    });
    return unit;
  }

  async delete(id: string) {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
    this.store.bodyCorperate.nedbank.remove(id);
  }
}
