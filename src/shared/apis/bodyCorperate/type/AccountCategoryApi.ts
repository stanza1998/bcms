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
import { db } from "../../../database/FirebaseConfig";
import { IAccountCategory } from "../../../models/Types/AccountCategories";

export default class AccountCategoryApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string) {
    const myPath = `BodyCoperate/${pid}/AccountCategory`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IAccountCategory[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IAccountCategory);
          });

          this.store.bodyCorperate.accountCategory.load(items);
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
    const myPath = `BodyCoperate/${pid}/AccountCategory`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IAccountCategory;

      this.store.bodyCorperate.accountCategory.load([item]);
    });

    return unsubscribe;
  }

  //rememberId
  async create(item: IAccountCategory, pid: string) {
    const myPath = `BodyCoperate/${pid}/AccountCategory`;

    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.accountCategory.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }
  async update(account: IAccountCategory, pid: string) {
    const myPath = `BodyCoperate/${pid}/AccountCategory`;
    try {
      await updateDoc(doc(db, myPath, account.id), {
        ...account,
      });

      this.store.bodyCorperate.accountCategory.load([account]);
    } catch (error) {}
  }

  async delete(id: string, pid: string) {
    const myPath = `BodyCoperate/${pid}/AccountCategory`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.accountCategory.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
