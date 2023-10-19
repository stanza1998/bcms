import { setDoc, doc } from "@firebase/firestore";
import { getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import { db, storage } from "../database/FirebaseConfig";
import { ISystemTheme } from "../models/Theme";

export default class SystemSettingsApi {
  path: string = "Settings";

  constructor(private api: AppApi, private store: AppStore) { }

  async create(value: any) {
    const cityRef = doc(db, this.path, "systemsettings");
    await setDoc(cityRef, { ...value }, { merge: true });
    this.getSettings();
  }

  async getSettings() {
    if (!this.path) return;
    const docRef = doc(db, this.path, "systemsettings");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.store.settings.load({ ...docSnap.data() } as ISystemTheme);
    } else { }
  }

  async uploadLogoFile(file: File) {
    const filePath = `${this.path}/${file.name}`;
    const uploadTask = uploadBytesResumable(ref(storage, filePath), file)
    uploadTask.on('state_changed', (snapshot) => {
      this.store.settings.loading = true;
    }, (error) => { }, () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        this.store.settings.loading = false;
        const value = { logoUrl: downloadURL }
        this.create({ ...value });
      });
    }
    );
  }
}
