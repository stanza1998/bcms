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
import { IDocumentCategory } from "../../../models/communication/documents/DocumentCategories";


export default class DocumentCategoryApi {
    constructor(private api: AppApi, private store: AppStore) { }

    async getAll(pid: string) {
        const myPath = `BodyCoperate/${pid}/DocumentCategories`;

        const $query = query(collection(db, myPath));
        // new promise
        return await new Promise<Unsubscribe>((resolve, reject) => {
            // on snapshot
            const unsubscribe = onSnapshot(
                $query,
                // onNext
                (querySnapshot) => {
                    const items: IDocumentCategory[] = [];
                    querySnapshot.forEach((doc) => {
                        items.push({ id: doc.id, ...doc.data() } as IDocumentCategory);
                    });

                    this.store.communication.documentCategory.load(items);
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
        const myPath = `BodyCoperate/${pid}/DocumentCategories`;

        const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IDocumentCategory;

            this.store.communication.documentCategory.load([item]);
        });

        return unsubscribe;
    }

    async create(item: IDocumentCategory, pid: string) {
        const myPath = `BodyCoperate/${pid}/DocumentCategories`;

        const itemRef = doc(collection(db, myPath));
        item.id = itemRef.id;

        // create in db
        try {
            await setDoc(itemRef, item, {
                merge: true,
            });
            // create in store
            this.store.communication.documentCategory.load([item]);
        } catch (error) {
            // console.log(error);
        }
    }

    async update(documentCatgeory: IDocumentCategory, pid: string) {
        const myPath = `BodyCoperate/${pid}/DocumentCategories`;
        try {
            await updateDoc(doc(db, myPath, documentCatgeory.id), {
                ...documentCatgeory,
            });

            this.store.communication.documentCategory.load([documentCatgeory]);
        } catch (error) { }
    }

    async delete(id: string, pid: string, yid: string) {
        const myPath = `BodyCoperate/${pid}/DocumentCategories`;
        try {
            await deleteDoc(doc(db, myPath, id));
            this.store.communication.documentCategory.remove(id);
        } catch (error) {
            console.log(error);
        }
    }
}
