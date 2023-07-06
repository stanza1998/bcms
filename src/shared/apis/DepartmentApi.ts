import {
  CollectionReference,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import IDepartment from "../interfaces/IDepartment";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";

export default class DepartmentApi {
  collectionRef: CollectionReference;
  constructor(
    private api: AppApi,
    private store: AppStore,
    collectionRef: CollectionReference
  ) {
    this.collectionRef = collectionRef;
  }

  async getAll() {
    const q = query(this.collectionRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: IDepartment[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id } as IDepartment);
      });

      this.store.department.load(items);
    });

    return unsubscribe;
  }

  async create(department: IDepartment) {
    const docRef = doc(this.collectionRef);
    department.id = docRef.id;
    await setDoc(docRef, department, { merge: true });
    return department;
  }

  async update(department: IDepartment) {
    await setDoc(doc(this.collectionRef, department.id), department);
    return department;
  }

  async delete(id: string) {
    // search user where department id ==id
    const isNotEmpty = await this.api.auth.doesDepartmentHasUsers(id);
    if (isNotEmpty) throw new Error("Containes users");

    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
    this.store.department.remove(id);
  }
}
