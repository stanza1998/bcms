import {
    Unsubscribe,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import AppApi from "../../AppApi";
import AppStore from "../../../stores/AppStore";
import { db } from "../../../database/FirebaseConfig";
import { IAccountTransactions } from "../../../models/accounts-transaction/AccountsTransactionModel";

export default class AccountsTransactionsApi {
    constructor(private api: AppApi, private store: AppStore) { }

    async getAll(pid: string, yid: string) {
        const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/AccountsTransactions`;
        const $query = query(collection(db, myPath));
        // new promise
        return await new Promise<Unsubscribe>((resolve, reject) => {
            // on snapshot
            const unsubscribe = onSnapshot(
                $query,
                // onNext
                (querySnapshot) => {
                    const items: IAccountTransactions[] = [];
                    querySnapshot.forEach((doc) => {
                        items.push({ id: doc.id, ...doc.data() } as IAccountTransactions);
                    });

                    this.store.bodyCorperate.accountsTransactions.load(items);
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
        const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/AccountsTransactions`;

        const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IAccountTransactions;
            this.store.bodyCorperate.accountsTransactions.load([item]);
        });
        return unsubscribe;
    }

    async create(item: IAccountTransactions, pid: string, yid: string) {
        const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/AccountsTransactions`;
        const itemRef = doc(collection(db, myPath));
        item.id = itemRef.id;

        // create in db
        try {
            await setDoc(itemRef, item, {
                merge: true,
            });
            // create in store
            this.store.bodyCorperate.accountsTransactions.load([item]);
        } catch (error) {
            // console.log(error);
        }
    }

    async update(
        product: IAccountTransactions,
        pid: string,
        yid: string,
        mid: string
    ) {
        const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/AccountsTransactions`;
        try {
            await updateDoc(doc(db, myPath, product.id), {
                ...product,
            });

            this.store.bodyCorperate.accountsTransactions.load([product]);
        } catch (error) { }
    }

    async delete(id: string, pid: string, yid: string) {
        const myPath = `BodyCoperate/${pid}/FinancialYear/${yid}/AccountsTransactions`;
        try {
            await deleteDoc(doc(db, myPath, id));
            this.store.bodyCorperate.accountsTransactions.remove(id);
        } catch (error) {
            console.log(error);
        }
    }
}
