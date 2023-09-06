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
import { ITransfer } from "../../../models/Types/Transfer";
import { db } from "../../../database/FirebaseConfig";

  
  export default class TransferApi {
    collectionRef: CollectionReference;
    constructor(
      private api: AppApi,
      private store: AppStore,
      collectionRef: CollectionReference
    ) {
      this.collectionRef = collectionRef;
    }
  
    async getAll(pid:string) {
      const myPath = `BodyCoperate/${pid}/Accounts`;
  
      const $query = query(collection(db, myPath));
      // new promise
      return await new Promise<Unsubscribe>((resolve, reject) => {
        // on snapshot
        const unsubscribe = onSnapshot(
          $query,
          // onNext
          (querySnapshot) => {
            const items: ITransfer[] = [];
            querySnapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() } as ITransfer);
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
  
  
    async getById(id: string, pid:string) {
      const myPath = `BodyCoperate/${pid}/Accounts`;
  
      const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
        if (!doc.exists) return;
        const item = { id: doc.id, ...doc.data() } as ITransfer;
  
        this.store.bodyCorperate.account.load([item]);
      });
  
      return unsubscribe;
    }
  
    //rememberId
    async create(item: ITransfer, pid:string) {
      const myPath = `BodyCoperate/${pid}/Accounts`;
  
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
    async update(account: ITransfer, pid:string) {
      const myPath = `BodyCoperate/${pid}/Accounts`;
      try {
        await updateDoc(doc(db, myPath, account.id), {
          ...account,
        });
  
        this.store.bodyCorperate.account.load([account]);
      } catch (error) {}
    }
  
    async delete(id: string, pid:string) {
      const myPath = `BodyCoperate/${pid}/Accounts`;
      try {
        await deleteDoc(doc(db, myPath, id));
        this.store.bodyCorperate.account.remove(id);
      } catch (error) {
        console.log(error);
      }
    }
  }
  