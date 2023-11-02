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
import { IAnnouncements } from "../../../models/communication/announcements/AnnouncementModel";

export default class AnnouncementApi {
  constructor(private api: AppApi, private store: AppStore) {}

  async getAll(pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/Announcements`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IAnnouncements[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IAnnouncements);
          });

          this.store.communication.announcements.load(items);
          resolve(unsubscribe);
        },
        // onError
        (error) => {
          reject();
        }
      );
    });
  }

  async getById(id: string, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/Announcements`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IAnnouncements;

      this.store.communication.announcements.load([item]);
    });

    return unsubscribe;
  }

  async create(item: IAnnouncements, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/Announcements`;

    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.communication.announcements.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(announcement: IAnnouncements, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/Announcements`;
    try {
      await updateDoc(doc(db, myPath, announcement.id), {
        ...announcement,
      });

      this.store.communication.announcements.load([announcement]);
    } catch (error) {}
  }

  async delete(id: string, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/Announcements`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.communication.announcements.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
