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
import { IDocumentFile } from "../../../models/communication/documents/DocumentFiles";

export default class DocumentFileApi {
    constructor(private api: AppApi, private store: AppStore) { }

    async getAll(pid: string, did: string) {
        const myPath = `BodyCoperate/${pid}/DocumentCategories/${did}/DocumentFiles`;

        const $query = query(collection(db, myPath));
        // new promise
        return await new Promise<Unsubscribe>((resolve, reject) => {
            // on snapshot
            const unsubscribe = onSnapshot(
                $query,
                // onNext
                (querySnapshot) => {
                    const items: IDocumentFile[] = [];
                    querySnapshot.forEach((doc) => {
                        items.push({ id: doc.id, ...doc.data() } as IDocumentFile);
                    });

                    this.store.communication.documentFile.load(items);
                    resolve(unsubscribe);
                },
                // onError
                (error) => {
                    reject();
                }
            );
        });
    }

    async getById(id: string, pid: string, did: string) {
        const myPath = `BodyCoperate/${pid}/DocumentCategories/${did}/DocumentFiles`;

        const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IDocumentFile;

            this.store.communication.documentFile.load([item]);
        });

        return unsubscribe;
    }

    async create(item: IDocumentFile, pid: string, did: string) {
        const myPath = `BodyCoperate/${pid}/DocumentCategories/${did}/DocumentFiles`;

        const itemRef = doc(collection(db, myPath));
        item.id = itemRef.id;

        // create in db
        try {
            await setDoc(itemRef, item, {
                merge: true,
            });
            // create in store
            this.store.communication.documentFile.load([item]);
        } catch (error) {
            // console.log(error);
        }
    }

    async update(documentFile: IDocumentFile, pid: string, did: string) {
        const myPath = `BodyCoperate/${pid}/DocumentCategories/${did}/DocumentFiles`;
        try {
            await updateDoc(doc(db, myPath, documentFile.id), {
                ...documentFile,
            });

            this.store.communication.documentFile.load([documentFile]);
        } catch (error) { }
    }

    async delete(id: string, pid: string, did: string) {
        const myPath = `BodyCoperate/${pid}/DocumentCategories/${did}/DocumentFiles`;
        try {
            await deleteDoc(doc(db, myPath, id));
            this.store.communication.documentFile.remove(id);
        } catch (error) {
            console.log(error);
        }
    }
}
