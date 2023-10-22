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
import { db } from "../../../../database/FirebaseConfig";
import { IWorkOrderFlow } from "../../../../models/maintenance/request/work-order-flow/WorkOrderFlow";


export default class WorkOderFlowApi {
    constructor(private api: AppApi, private store: AppStore) { }

    async getAll(pid: string, mid:string) {
        const myPath = `BodyCoperate/${pid}/MaintenanceRequest/${mid}/WorkFlowOrder`;

        const $query = query(collection(db, myPath));
        // new promise
        return await new Promise<Unsubscribe>((resolve, reject) => {
            // on snapshot
            const unsubscribe = onSnapshot(
                $query,
                // onNext
                (querySnapshot) => {
                    const items: IWorkOrderFlow[] = [];
                    querySnapshot.forEach((doc) => {
                        items.push({ id: doc.id, ...doc.data() } as IWorkOrderFlow);
                    });

                    this.store.maintenance.work_flow_order.load(items);
                    resolve(unsubscribe);
                },
                // onError
                (error) => {
                    reject();
                }
            );
        });
    }

    async getById(id: string, pid: string, mid:string) {
        const myPath = `BodyCoperate/${pid}/MaintenanceRequest/${mid}/WorkFlowOrder`;

        const unsubscribe = onSnapshot(doc(db, myPath, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IWorkOrderFlow;

            this.store.maintenance.work_flow_order.load([item]);
        });

        return unsubscribe;
    }

    async create(item: IWorkOrderFlow, pid: string, mid:string) {
        const myPath = `BodyCoperate/${pid}/MaintenanceRequest/${mid}/WorkFlowOrder`;

        const itemRef = doc(collection(db, myPath));
        item.id = itemRef.id;

        // create in db
        try {
            await setDoc(itemRef, item, {
                merge: true,
            });
            // create in store
            this.store.maintenance.work_flow_order.load([item]);
        } catch (error) {
            // console.log(error);
        }
    }

    async update(custom_contact: IWorkOrderFlow, pid: string, mid:string) {
        const myPath = `BodyCoperate/${pid}/MaintenanceRequest/${mid}/WorkFlowOrder`;
        try {
            await updateDoc(doc(db, myPath, custom_contact.id), {
                ...custom_contact,
            });

            this.store.maintenance.work_flow_order.load([custom_contact]);
        } catch (error) { }
    }

    async delete(id: string, pid: string, mid:string) {
        const myPath = `BodyCoperate/${pid}/MaintenanceRequest/${mid}/WorkFlowOrder`;
        try {
            await deleteDoc(doc(db, myPath, id));
            this.store.maintenance.work_flow_order.remove(id);
        } catch (error) {
            console.log(error);
        }
    }
}
