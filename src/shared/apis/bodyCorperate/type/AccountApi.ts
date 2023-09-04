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
import { INormalAccount } from "../../../models/Types/Account";
import { db } from "../../../database/FirebaseConfig";

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
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/Accounts`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: INormalAccount[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as INormalAccount);
          });

          this.store.bodyCorperate.account.load(items);
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
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/Accounts`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as INormalAccount;

      this.store.bodyCorperate.account.load([item]);
    });

    return unsubscribe;
  }

  //rememberId
  async create(item: INormalAccount) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/Accounts`;

    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.bodyCorperate.account.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }
  async update(account: INormalAccount) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/Accounts`;
    try {
      await updateDoc(doc(db, myPath, account.id), {
        ...account,
      });

      this.store.bodyCorperate.account.load([account]);
    } catch (error) {}
  }

  async delete(id: string) {
    const myPath = `BodyCoperate/4Q5WwF2rQFmoStdpmzaW/Accounts`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.bodyCorperate.account.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
