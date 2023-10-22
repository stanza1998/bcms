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
import AppApi from "../../../../AppApi";
import AppStore from "../../../../../stores/AppStore";
import { db } from "../../../../../database/FirebaseConfig";
import { IRequestType } from "../../../../../models/maintenance/request/maintenance-request/types/RequestTypes";


export default class RequestTypeApi {
    constructor(private api: AppApi, private store: AppStore) { }

    async getAll(pid: string) {
        const myPath = `BodyCoperate/${pid}/RequestType`;

        const $query = query(collection(db, myPath));
        // new promise
        return await new Promise<Unsubscribe>((resolve, reject) => {
            // on snapshot
            const unsubscribe = onSnapshot(
                $query,
                // onNext
                (querySnapshot) => {
                    const items: IRequestType[] = [];
                    querySnapshot.forEach((doc) => {
                        items.push({ id: doc.id, ...doc.data() } as IRequestType);
                    });

                    this.store.maintenance.requestType.load(items);
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
        const myPath = `BodyCoperate/${pid}/RequestType`;

        const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IRequestType;

            this.store.maintenance.requestType.load([item]);
        });

        return unsubscribe;
    }

    async create(item: IRequestType, pid: string) {
        const myPath = `BodyCoperate/${pid}/RequestType`;

        const itemRef = doc(collection(db, myPath));
        item.id = itemRef.id;

        // create in db
        try {
            await setDoc(itemRef, item, {
                merge: true,
            });
            // create in store
            this.store.maintenance.requestType.load([item]);
        } catch (error) {
            // console.log(error);
        }
    }

    async update(custom_contact: IRequestType, pid: string) {
        const myPath = `BodyCoperate/${pid}/RequestType`;
        try {
            await updateDoc(doc(db, myPath, custom_contact.id), {
                ...custom_contact,
            });

            this.store.maintenance.requestType.load([custom_contact]);
        } catch (error) { }
    }

    async delete(id: string, pid: string) {
        const myPath = `BodyCoperate/${pid}/RequestType`;
        try {
            await deleteDoc(doc(db, myPath, id));
            this.store.maintenance.requestType.remove(id);
        } catch (error) {
            console.log(error);
        }
    }
}
