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
import { IPrivateMessage } from "../../../models/communication/private-message/PrivateMessage";

export default class PrivateMessageApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string) {
    const myPath = `BodyCoperate/${pid}/PrivateMessages`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IPrivateMessage[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IPrivateMessage);
          });

          this.store.communication.privateMessage.load(items);
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
    const myPath = `BodyCoperate/${pid}/PrivateMessages`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IPrivateMessage;

      this.store.communication.privateMessage.load([item]);
    });

    return unsubscribe;
  }

  async create(item: IPrivateMessage, pid: string) {
    const myPath = `BodyCoperate/${pid}/PrivateMessages`;

    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.communication.privateMessage.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(message: IPrivateMessage, pid: string) {
    const myPath = `BodyCoperate/${pid}/PrivateMessages`;
    try {
      await updateDoc(doc(db, myPath, message.id), {
        ...message,
      });

      this.store.communication.privateMessage.load([message]);
    } catch (error) {}
  }

  async delete(id: string, pid: string) {
    const myPath = `BodyCoperate/${pid}/PrivateMessages`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.communication.privateMessage.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
