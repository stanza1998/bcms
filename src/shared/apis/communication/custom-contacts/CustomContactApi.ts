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
import AppApi from "../../AppApi";
import AppStore from "../../../stores/AppStore";
import { db } from "../../../database/FirebaseConfig";
import { ICustomContact } from "../../../models/communication/contact-management/CustomContacts";

export default class CustomContactApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string) {
    const myPath = `BodyCoperate/${pid}/CustomContact`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: ICustomContact[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as ICustomContact);
          });

          this.store.communication.customContacts.load(items);
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
    const myPath = `BodyCoperate/${pid}/CustomContact`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as ICustomContact;

      this.store.communication.customContacts.load([item]);
    });

    return unsubscribe;
  }

  async create(item: ICustomContact, pid: string) {
    const myPath = `BodyCoperate/${pid}/CustomContact`;

    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.communication.customContacts.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(custom_contact: ICustomContact, pid: string) {
    const myPath = `BodyCoperate/${pid}/CustomContact`;
    try {
      await updateDoc(doc(db, myPath, custom_contact.id), {
        ...custom_contact,
      });

      this.store.communication.customContacts.load([custom_contact]);
    } catch (error) {}
  }

  async delete(id: string, pid: string) {
    const myPath = `BodyCoperate/${pid}/CustomContact`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.communication.customContacts.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
