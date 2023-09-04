import {
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import AppApi from "../AppApi";
import AppStore from "../../stores/AppStore";
import { IUnit } from "../../models/bcms/Units";
import { db } from "../../database/FirebaseConfig";

export default class UnitApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll() {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/Units`;

    const $query = query(collection(db, myPath));

    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IUnit[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IUnit);
          });

          this.store.bodyCorperate.unit.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getById(id: string) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/Units`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IUnit;

      this.store.bodyCorperate.unit.load([item]);
    });

    return unsubscribe;
  }
  // remember id
  async create(item: IUnit) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/Units`;
    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.unit.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(item: IUnit) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/Units`;

    // update in db
    try {
      await updateDoc(doc(db, myPath, item.id), {
        ...item,
      });
      // update in store
      this.store.bodyCorperate.unit.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }
  async delete(id: string) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/Units`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.unit.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
