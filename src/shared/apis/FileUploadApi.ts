import {
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
const storage = getStorage();

export const getFilesInStorage = async (path: string) => {};

// upload multiple files

export const uploadBlobToStorage = (file: File, path: string) => {
  const storageRef = ref(storage, `${path}/${file.name}`);

  // 'file' comes from the Blob or File API
  const uploadTask = uploadBytesResumable(storageRef, file);

  // let isUploading = true;
  // let progress = 0;
  // let errorCode = "";
  // let downloadURL = "";

  return uploadTask;
};

export const deleteFileFromDownloadURL = async (url: string) => {};

export const deleteFileFromStorage = async (url: string) => {};

// Listen for state changes, errors, and completion of the upload.
// await uploadTask.on(
//   "state_changed",
//   (snapshot) => {
//     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//     progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//     console.log("Upload is " + progress + "% done");
//     switch (snapshot.state) {
//       case "paused":
//         isUploading = false;
//         errorCode = "Upload is paused";
//         console.log("Upload is paused");
//         break;
//       case "running":
//         isUploading = true;
//         errorCode = "";
//         console.log("Upload is running");
//         break;
//     }
//   },
//   (error) => {
//     switch (error.code) {
//       case "storage/unauthorized":
//         errorCode = "User doesn't have permission to access the object";
//         break;
//       case "storage/canceled":
//         errorCode = "User canceled the upload";
//         break;
//       case "storage/unknown":
//         errorCode = "Unknown error occurred, contact admin.";
//         break;
//     }
//   },
//   async () => {
//     // Upload completed successfully, now we can get the download URL
//     downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//     errorCode = "";
//     isUploading = false;
//     progress = 100;
//     console.log("File available at", downloadURL);
//   }
// );

// return [isUploading, errorCode, progress, downloadURL];
