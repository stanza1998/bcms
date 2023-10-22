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
import { IServiceProvider } from "../../../models/maintenance/service-provider/ServiceProviderModel";
  
  export default class ServiceProviderApi {
    constructor(private api: AppApi, private store: AppStore) {}
  
    async getAll(pid: string) {
      const myPath = `BodyCoperate/${pid}/ServiceProvider`;
  
      const $query = query(collection(db, myPath));
      // new promise
      return await new Promise<Unsubscribe>((resolve, reject) => {
        // on snapshot
        const unsubscribe = onSnapshot(
          $query,
          // onNext
          (querySnapshot) => {
            const items: IServiceProvider[] = [];
            querySnapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() } as IServiceProvider);
            });
  
            this.store.maintenance.servie_provider.load(items);
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
      const myPath = `BodyCoperate/${pid}/ServiceProvider`;
  
      const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
        if (!doc.exists) return;
        const item = { id: doc.id, ...doc.data() } as IServiceProvider;
  
        this.store.maintenance.servie_provider.load([item]);
      });
  
      return unsubscribe;
    }
  
    async create(item: IServiceProvider, pid: string) {
      const myPath = `BodyCoperate/${pid}/ServiceProvider`;
  
      const itemRef = doc(collection(db, myPath));
      item.id = itemRef.id;
  
      // create in db
      try {
        await setDoc(itemRef, item, {
          merge: true,
        });
        // create in store
        this.store.maintenance.servie_provider.load([item]);
      } catch (error) {
        // console.log(error);
      }
    }
  
    async update(custom_contact: IServiceProvider, pid: string) {
      const myPath = `BodyCoperate/${pid}/ServiceProvider`;
      try {
        await updateDoc(doc(db, myPath, custom_contact.id), {
          ...custom_contact,
        });
  
        this.store.maintenance.servie_provider.load([custom_contact]);
      } catch (error) {}
    }
  
    async delete(id: string, pid: string) {
      const myPath = `BodyCoperate/${pid}/ServiceProvider`;
      try {
        await deleteDoc(doc(db, myPath, id));
        this.store.maintenance.servie_provider.remove(id);
      } catch (error) {
        console.log(error);
      }
    }
  }
  