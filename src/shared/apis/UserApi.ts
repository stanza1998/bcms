import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
  deleteUser,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { USER_ROLES } from "../constants/USER_ROLES";
import { auth, db, authWorker } from "../database/FirebaseConfig";
import { IUser } from "../interfaces/IUser";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";

export default class UserApi {
  constructor(private api: AppApi, private store: AppStore) {
    this.onAuthChanged();
  }

  onAuthChanged() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await this.onSignedIn(user.uid);
      } else {
        await this.onSignedOut();
      }
    });
  }

  private async onSignedIn(uid: string) {
    this.store.user.loading = true;
    const userDoc = await getDoc(doc(db, "Users", uid));

    if (!userDoc.exists()) {
      this.store.user.loading = false;
      return;
    }
    const user = { uid: userDoc.id, ...userDoc.data() } as IUser;
    this.store.user.loadCurrentUser(user);
    this.store.user.loading = false;
  }

  private async onSignedOut() {
    this.store.user.loading = true;
    this.store.user.removeCurrentUser();
    this.store.user.loading = false;
  }

  async updateMetadata(value: string) {
    const docRef = doc(db, "Metadata", "uids");

    await setDoc(docRef, {
      uidArray: arrayUnion(value),
    });
  }
  // User will be created with authWorker, thus not signed-in
  // async createUser(user: IUser) {
  //   const { email, password = `${user.firstName}@${user.lastName}` } = user;
  //   const userCredential = await createUserWithEmailAndPassword(authWorker, email, password).catch((error) => {
  //     return null;
  //   });
  async createUser(user: IUser) {
    const { email, password = `${user.firstName}@${user.lastName}` } = user;
    console.log("About to create owner");
    console.log("Entered email and password: "+email+" "+password);
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      authWorker,
      email,
      password
    ).catch((error) => {
      console.log("Owner Created");

      return null;
    });

    if (userCredential) {
      // Update user document in Firestore
      user.uid = userCredential.user.uid;
      user.password = "";
      await setDoc(doc(db, "Users", user.uid), user);

      // Send welcome email with a link to reset password
      await sendPasswordResetEmail(authWorker, email, {
        url: "http://localhost:3000/change-password", // Set the URl to app url https://vanwylbcms.web.app/
        handleCodeInApp: true,
      });
      //owner details
      //CATHERINE
      // JANUARIE
      // +264 0812230035
      // catherinejanuarie7@gmail.com
      // Update metadata and load user into the store
      await this.updateMetadata(user.uid);
      this.store.user.load([user]);
    }

    return user;
  }

  //   if (userCredential) {
  //     user.uid = userCredential.user.uid;
  //     user.password = "";
  //     await setDoc(doc(db, "Users", user.uid), user);
  //     await this.updateMetadata(user.uid)
  //     this.store.user.load([user])
  //     await signOut(authWorker);
  //   }
  //   return user;
  // }

  // Update user info
  async updateUser(user: IUser) {
    await setDoc(doc(db, "Users", user.uid), user);
    this.store.user.load([user]);
    return user;
  }

  //   User will be created and signed-in
  // async onSignup(user: IUser) {
  //   const { email, password = `${user.firstName}@${user.lastName}` } = user;
  //   const userCredential = await createUserWithEmailAndPassword(
  //     auth,
  //     email,
  //     password
  //   ).catch((error) => {
  //     return null;
  //   });

  //   if (userCredential) {
  //     user.uid = userCredential.user.uid;
  //     await setDoc(doc(db, "Users", user.uid), user);
  //   }
  //   return userCredential;
  // }

  async signIn(email: string, password: string) {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .catch((error) => {
        return null;
      });

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    ).catch((error) => {
      return null;
    });

    if (userCredential) return userCredential.user;
    return userCredential;
  }

  async signOutUser() {
    signOut(auth);
  }

  async removeUser(user: User) {
    await deleteUser(user);
    await this.deleteUserFromDB(user.uid);
    return;
  }

  async passwordResetWithEmail(email: string) {
    await sendPasswordResetEmail(auth, email)
      .then(function () {
        alert("Password reset email sent.");
      })
      .catch(function (error) {
        alert("Could not send email.");
      });
  }

  async passwordResetWithOldPassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ) {
    const credential = EmailAuthProvider.credential(email, oldPassword);
    const user = auth.currentUser;
    if (!user) return;
    await reauthenticateWithCredential(user, credential)
      .then(() => {
        if (newPassword.length >= 6)
          // User re-authenticated.
          updatePassword(user, newPassword)
            .then(function () {
              // Update successful.
              alert("Password reset successfully");
            })
            .catch(function (error) {
              // An error happened.
              alert("Could not reset password");
            });
        else alert("Password should be atleast 6 characters long");
      })
      .catch((error) => {
        // An error happened.
        alert("Incorrect password");
      });
  }

  async loadUser(uid: string) {
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const user = { ...docSnap.data(), uid: docSnap.id } as IUser;
      this.store.user.load([user]);
      return user;
    } else return undefined;
  }

  async deleteUserFromDB(uid: string) {
    const docRef = doc(db, "Users", uid);
    await deleteDoc(docRef);
  }

  async loadAll() {
    this.store.user.removeAll();
    const $query = query(collection(db, "Users"), orderBy("firstName"));
    const querySnapshot = await getDocs($query);
    const users = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), uid: doc.id } as IUser;
    });
    this.store.user.load(users);
  }

  async doesDepartmentHasUsers(id: string) {
    const $query = query(
      collection(db, "Users"),
      where("departmentId", "==", id)
    );
    const querySnapshot = await getDocs($query);
    const users = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), uid: doc.id } as IUser;
    });
    return users.length !== 0 ? true : false;
  }

  async doesRegionHasUsers(id: string) {
    const $query = query(collection(db, "Users"), where("regionId", "==", id));
    const querySnapshot = await getDocs($query);
    const users = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), uid: doc.id } as IUser;
    });
    return users.length !== 0 ? true : false;
  }

  async loadHRAdmin() {
    // const adminRoles = [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.GENERAL_MANAGER,
    // USER_ROLES.MANAGING_DIRECTOR, USER_ROLES.HUMAN_RESOURCE, USER_ROLES.SUPERVISOR];

    const adminRoles = [
      USER_ROLES.ADMIN,
      USER_ROLES.HUMAN_RESOURCE,
      USER_ROLES.SUPERVISOR,
    ];

    const $query = query(
      collection(db, "Users"),
      where("role", "in", adminRoles),
      where("devUser", "==", false)
    );
    const querySnapshot = await getDocs($query);
    const users = querySnapshot.docs.map((doc) => {
      return { uid: doc.id, ...doc.data() } as IUser;
    });
    return users;
  }

  async loadSupervisor() {
    const supervisor = this.store.user.meJson?.supervisor;

    const $query = query(
      collection(db, "Users"),
      where("uid", "==", supervisor)
    );
    const querySnapshot = await getDocs($query);
    const users = querySnapshot.docs.map((doc) => {
      return { uid: doc.id, ...doc.data() } as IUser;
    });
    return users;
  }
}
