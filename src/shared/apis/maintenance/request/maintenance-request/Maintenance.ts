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
import AppApi from "../../../AppApi";
import AppStore from "../../../../stores/AppStore";
import { IMaintenanceRequest } from "../../../../models/maintenance/request/maintenance-request/MaintenanceRequest";
import { db } from "../../../../database/FirebaseConfig";

  
  export default class MaintenanceRequestApi {
    constructor(private api: AppApi, private store: AppStore) {}
  
    async getAll(pid: string) {
      const myPath = `BodyCoperate/${pid}/MaintenanceRequest`;
  
      const $query = query(collection(db, myPath));
      // new promise
      return await new Promise<Unsubscribe>((resolve, reject) => {
        // on snapshot
        const unsubscribe = onSnapshot(
          $query,
          // onNext
          (querySnapshot) => {
            const items: IMaintenanceRequest[] = [];
            querySnapshot.forEach((doc) => {
              items.push({ id: doc.id, ...doc.data() } as IMaintenanceRequest);
            });
  
            this.store.maintenance.maintenance_request.load(items);
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
      const myPath = `BodyCoperate/${pid}/MaintenanceRequest`;
  
      const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
        if (!doc.exists) return;
        const item = { id: doc.id, ...doc.data() } as IMaintenanceRequest;
  
        this.store.maintenance.maintenance_request.load([item]);
      });
  
      return unsubscribe;
    }
  
    async create(item: IMaintenanceRequest, pid: string) {
      const myPath = `BodyCoperate/${pid}/MaintenanceRequest`;
  
      const itemRef = doc(collection(db, myPath));
      item.id = itemRef.id;
  
      // create in db
      try {
        await setDoc(itemRef, item, {
          merge: true,
        });
        // create in store
        this.store.maintenance.maintenance_request.load([item]);
      } catch (error) {
        // console.log(error);
      }
    }
  
    async update(custom_contact: IMaintenanceRequest, pid: string) {
      const myPath = `BodyCoperate/${pid}/MaintenanceRequest`;
      try {
        await updateDoc(doc(db, myPath, custom_contact.id), {
          ...custom_contact,
        });
  
        this.store.maintenance.maintenance_request.load([custom_contact]);
      } catch (error) {}
    }
  
    async delete(id: string, pid: string) {
      const myPath = `BodyCoperate/${pid}/MaintenanceRequest`;
      try {
        await deleteDoc(doc(db, myPath, id));
        this.store.maintenance.maintenance_request.remove(id);
      } catch (error) {
        console.log(error);
      }
    }
  }
  