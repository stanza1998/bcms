import {
  getDownloadURL,
  StorageReference,
  UploadTask,
} from "firebase/storage";
import { useState } from "react";
import { uploadBlobToStorage } from "../../../shared/apis/FileUploadApi";

const waitForDownloadURL = async (ref: StorageReference) => {
  const $downloadUrl = await getDownloadURL(ref);
  return $downloadUrl;
};

interface UploadToStorageReturnType {
  isUploading: boolean;
  errorCode: string;
  progress: number;
  uploadFile: (file: File, path: string) => Promise<string>;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}

const useUploadToStorage = (): UploadToStorageReturnType => {
  const [uploadTask, setUploadTask] = useState<UploadTask | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [progress, setProgress] = useState(0);

  const onPause = () => {
    if (uploadTask) uploadTask.pause();
  };

  const onResume = () => {
    if (uploadTask) uploadTask.resume();
  };

  const onCancel = () => {
    if (uploadTask) uploadTask.cancel();
  };

  const uploadFile = async (file: File, path: string) => {
    const uploadTask = uploadBlobToStorage(file, path);

    setIsUploading(true);

    setUploadTask(uploadTask);

    await uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const $progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + $progress + "% done");
        setProgress($progress);

        switch (snapshot.state) {
          case "paused":
            setIsUploading(false);
            setErrorCode("Upload is paused");
            console.log("Upload is paused");
            break;
          case "running":
            setIsUploading(true);
            setErrorCode("");
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            setErrorCode("User doesn't have permission to access the object");
            break;
          case "storage/canceled":
            setErrorCode("User canceled the upload");
            break;
          case "storage/unknown":
            setErrorCode("Unknown error occurred, contact admin.");
            break;
        }
      },
      async () => {
        // Upload completed successfully, now we can get the download URL
        setErrorCode("");
        setIsUploading(false);
        setProgress(100);
      }
    );

    // Wait for upload to compelete
    await uploadTask.then();
    // Get download url.
    const $downloadUrl = await waitForDownloadURL(uploadTask.snapshot.ref);

    return $downloadUrl;
  };

  return {
    isUploading,
    errorCode,
    progress,
    uploadFile,
    onPause,
    onResume,
    onCancel,
  };
};

export default useUploadToStorage;
