import {
  Unsubscribe,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import AppApi from "../../AppApi";
import AppStore from "../../../stores/AppStore";
import { IUnit } from "../../../models/bcms/Units";
import { db } from "../../../database/FirebaseConfig";
import UiStore from "../../../stores/UiStore";

export default class UnitApi {
  constructor(private api: AppApi, private store: AppStore, private ui: UiStore) { }

  async getAll(pid: string) {
    const myPath = `BodyCoperate/${pid}/Units`;

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

  async getById(id: string, pid: string) {
    const myPath = `BodyCoperate/${pid}/Units`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IUnit;

      this.store.bodyCorperate.unit.load([item]);
    });

    return unsubscribe;
  }
  // remember id
  async create(item: IUnit, pid: string) {
    // Check if the unit number is valid
    if (item.unitName === 0) {
      console.error('Unit number cannot be 0.');
      alert("Cannot create unit 0")
      return;
    }

    // Check if a unit with the same unitName already exists
    const unitCollectionRef = collection(db, `BodyCoperate/${pid}/Units`);
    const existingUnitQuery = query(unitCollectionRef, where('unitName', '==', item.unitName));
    const existingUnitSnapshot = await getDocs(existingUnitQuery);

    if (!existingUnitSnapshot.empty) {
      alert(`Unit ${item.unitName} already exist`)
      console.error(`Unit with unitName ${item.unitName} already exists.`);
      return;
    }

    // If everything is valid, proceed with creation
    const myPath = `BodyCoperate/${pid}/Units`;
    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });

      // create in store
      this.store.bodyCorperate.unit.load([item]);
      this.ui.snackbar.load({
        id: Date.now(),
        message: "Unit created!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      this.ui.snackbar.load({
        id: Date.now(),
        message: "Unit not created!",
        type: "danger",
      });
    }
  }



  async update(item: IUnit, pid: string) {
    const myPath = `BodyCoperate/${pid}/Units`;

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
  async delete(id: string, pid: string) {
    const myPath = `BodyCoperate/${pid}/Units`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.unit.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
