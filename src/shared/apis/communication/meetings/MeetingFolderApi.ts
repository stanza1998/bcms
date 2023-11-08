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
import { IMeetingFolder } from "../../../models/communication/meetings/MeetingFolder";

export default class MeetingFolderApi {
  constructor(private api: AppApi, private store: AppStore) { }

  async getAll(pid: string) {
    const myPath = `BodyCoperate/${pid}/MeetingFolders`;

    const $query = query(collection(db, myPath));
    // new promise
    return await new Promise<Unsubscribe>((resolve, reject) => {
      // on snapshot
      const unsubscribe = onSnapshot(
        $query,
        // onNext
        (querySnapshot) => {
          const items: IMeetingFolder[] = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as IMeetingFolder);
          });

          this.store.communication.meetingFolder.load(items);
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
    const myPath = `BodyCoperate/${pid}/MeetingFolders`;

    const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
      if (!doc.exists) return;
      const item = { id: doc.id, ...doc.data() } as IMeetingFolder;

      this.store.communication.meetingFolder.load([item]);
    });

    return unsubscribe;
  }

  async create(item: IMeetingFolder, pid: string) {
    const myPath = `BodyCoperate/${pid}/MeetingFolders`;

    const itemRef = doc(collection(db, myPath));
    item.id = itemRef.id;

    // create in db
    try {
      await setDoc(itemRef, item, {
        merge: true,
      });
      // create in store
      this.store.communication.meetingFolder.load([item]);
    } catch (error) {
      // console.log(error);
    }
  }

  async update(meetingFolder: IMeetingFolder, pid: string) {
    const myPath = `BodyCoperate/${pid}/MeetingFolders`;
    try {
      await updateDoc(doc(db, myPath, meetingFolder.id), {
        ...meetingFolder,
      });

      this.store.communication.meetingFolder.load([meetingFolder]);
    } catch (error) { }
  }

  async delete(id: string, pid: string, yid: string) {
    const myPath = `BodyCoperate/${pid}/MeetingFolders`;
    try {
      await deleteDoc(doc(db, myPath, id));
      this.store.communication.meetingFolder.remove(id);
    } catch (error) {
      console.log(error);
    }
  }
}
