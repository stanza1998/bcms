import {
  CollectionReference,
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import AppApi from "../../AppApi";
import AppStore from "../../../stores/AppStore";
import { ISupplier } from "../../../models/Types/Suppliers";
import { db } from "../../../database/FirebaseConfig";

export default class SupplierApi {
  // collectionRef: CollectionReference;
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid:string) {
    const myPath = `BodyCoperate/${pid}/Suppliers`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: ISupplier[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as ISupplier);
          });

          this.store.bodyCorperate.supplier.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }


  async getById(id: string, pid:string) {
    const myPath = `BodyCoperate/${pid}/Suppliers`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as ISupplier;

      this.store.bodyCorperate.supplier.load([item]);
    });

    return unsubscribe;
  }

  //rememberId
  async create(item: ISupplier, pid:string) {
    const myPath = `BodyCoperate/${pid}/Suppliers`;

    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.supplier.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }
  async update(supplier: ISupplier, pid:string) {
    const myPath = `BodyCoperate/${pid}/Suppliers`;
    try {
      await updateDoc(doc(db, myPath, supplier.id), {
        ...supplier,
      });

      this.store.bodyCorperate.supplier.load([supplier]);
    } catch (error) {}
  }

  async delete(id: string, pid:string) {
    const myPath = `BodyCoperate/${pid}/Suppliers`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.supplier.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
