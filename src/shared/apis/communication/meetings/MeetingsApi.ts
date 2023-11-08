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
import { IMeeting } from "../../../models/communication/meetings/Meeting";

export default class MeetingApi {
    constructor(private api: AppApi, private store: AppStore) { }

    async getAll(pid: string, fid: string) {
        const myPath = `BodyCoperate/${pid}/MeetingFolders/${fid}/Meetings`;

        const $query = query(collection(db, myPath));
        // new promise
        return await new Promise<Unsubscribe>((resolve, reject) => {
            // on snapshot
            const unsubscribe = onSnapshot(
                $query,
                // onNext
                (querySnapshot) => {
                    const items: IMeeting[] = [];
                    querySnapshot.forEach((doc) => {
                        items.push({ id: doc.id, ...doc.data() } as IMeeting);
                    });

                    this.store.communication.meeting.load(items);
                    resolve(unsubscribe);
                },
                // onError
                (error) => {
                    reject();
                }
            );
        });
    }

    async getById(id: string, pid: string, fid: string) {
        const myPath = `BodyCoperate/${pid}/MeetingFolders/${fid}/Meetings`;

        const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IMeeting;

            this.store.communication.meeting.load([item]);
        });

        return unsubscribe;
    }

    async create(item: IMeeting, pid: string, fid: string) {
        const myPath = `BodyCoperate/${pid}/MeetingFolders/${fid}/Meetings`;

        const itemRef = doc(collection(db, myPath));
        item.id = itemRef.id;

        // create in db
        try {
            await setDoc(itemRef, item, {
                merge: true,
            });
            // create in store
            this.store.communication.meeting.load([item]);
        } catch (error) {
            // console.log(error);
        }
    }

    async update(meetingFolder: IMeeting, pid: string, fid: string) {
        const myPath = `BodyCoperate/${pid}/MeetingFolders/${fid}/Meetings`;
        try {
            await updateDoc(doc(db, myPath, meetingFolder.id), {
                ...meetingFolder,
            });

            this.store.communication.meeting.load([meetingFolder]);
        } catch (error) { }
    }

    async delete(id: string, pid: string, yid: string, fid: string) {
        const myPath = `BodyCoperate/${pid}/MeetingFolders/${fid}/Meetings`;
        try {
            await deleteDoc(doc(db, myPath, id));
            this.store.communication.meetingFolder.remove(id);
        } catch (error) {
            console.log(error);
        }
    }
}
