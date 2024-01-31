import AppStore from "../../shared/stores/AppStore";
import csv from "./file-icons/csv (2).png";
import _doc from "./file-icons/doc_4725970.png";
import docx from "./file-icons/docx_8361174.png";
import odp from "./file-icons/odp_10451906.png";
import odt from "./file-icons/odt_1975685.png";
import ods from "./file-icons/ods_9848919.png";
import pdf from "./file-icons/pdf_9496432.png";
import pptx from "./file-icons/pptx_10452012.png";
import ppt from "./file-icons/ppt_4726016.png";
import xls from "./file-icons/xls-file_9681350.png";
import _xlsx from "./file-icons/xlsx_8361467.png";
import d from "./file-icons/documentation_10517465.png";
import { IUser } from "../../shared/interfaces/IUser";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../../shared/database/FirebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { IWorkOrderFlow } from "../../shared/models/maintenance/request/work-order-flow/WorkOrderFlow";
import { IAnnouncements } from "../../shared/models/communication/announcements/AnnouncementModel";
import { IMaintenanceRequest } from "../../shared/models/maintenance/request/maintenance-request/MaintenanceRequest";
import { IUnit } from "../../shared/models/bcms/Units";
import { IServiceProvider } from "../../shared/models/maintenance/service-provider/ServiceProviderModel";
import { IBodyCop } from "../../shared/models/bcms/BodyCorperate";
import { useAppContext } from "../../shared/functions/Context";

export const getFileExtension = (url: string): string => {
  const extensionMatch = url.match(/\.([a-z0-9]+)(?:[?#]|$)/i);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : "";
  return "." + extension;
};

export const getFileName = (url: string): string => {
  const nameMatches = url.match(/%([^%]+)\.[a-z0-9]+(?:[?#]|$)/i);
  const name = nameMatches ? nameMatches[1] : "";
  return name;
};

export const getIconForExtensionExtra = (url: string): string => {
  const extensionMatch = url.match(/\.([a-z0-9]+)(?:[?#]|$)/i);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : "";

  switch (extension) {
    case "pdf":
      return pdf;
    case "doc":
      return _doc;
    case "docx":
      return docx;
    case "xls":
      return xls;
    case "xlsx":
      return _xlsx;
    case "ppt":
      return ppt;
    case "pptx":
      return pptx;
    case "odt":
      return odt;
    case "ods":
      return ods;
    case "odp":
      return odp;
    case "csv":
      return csv;
    default:
      return d;
  }
};

export const getIconForExtension = (extension: string): string => {
  switch (extension.toLowerCase()) {
    case "pdf":
      return pdf;
    case "doc":
      return _doc;
    case "docx":
      return docx;
    case "xls":
      return xls;
    case "xlsx":
      return _xlsx;
    case "ppt":
      return ppt;
    case "pptx":
      return pptx;
    case "odt":
      return odt;
    case "ods":
      return ods;
    case "odp":
      return odp;
    case "csv":
      return csv;
    default:
      return d;
  }
};

export function getUsersEmail(users: string[], store: AppStore): string[] {
  const usersEmails: string[] = users.map((user) => {
    return store.user.getById(user)?.asJson.email || "";
  });
  return usersEmails;
}

export function getServiceProviderEmails(
  serviceProviders: string[],
  store: AppStore
): string[] {
  const spEmails: string[] = serviceProviders.map((sp) => {
    return store.maintenance.servie_provider.getById(sp)?.asJson.email || "";
  });
  return spEmails;
}

export function getAwardedEmail(
  serviceProviders: IServiceProvider[],
  spId: string
): string | undefined {
  const awardedEmail = serviceProviders.find((sp) => sp.id === spId)?.email;
  if (awardedEmail) {
    return awardedEmail;
  } else {
    return "Not awarded email found";
  }
}

export function getCustomUserEmail(
  customUser: string[],
  store: AppStore
): string[] {
  const usersEmails: string[] = customUser.map((user) => {
    return store.communication.customContacts.getById(user)?.asJson.email || "";
  });
  return usersEmails;
}

export function getUserName(
  users: IUser[],
  announcements: IAnnouncements[],
  announcementId: string
): string | undefined {
  const announcement = announcements.find(
    (notice) => notice.id === announcementId
  );
  if (announcement) {
    const user = users.find((user) => user.uid === announcement.authorOrSender);
    if (user) {
      return user.firstName;
    }
  }
  return undefined;
}

export function getUserNameRequest(
  users: IUser[],
  request: IMaintenanceRequest[],
  id: string
): string | undefined {
  const req = request.find((r) => r.id === id);
  if (req) {
    const user = users.find((user) => user.uid === req.ownerId);
    if (user) {
      return user.firstName;
    }
  }
  return undefined;
}

export function getUnitsRequest(
  users: IUser[],
  units: IUnit[],
  id: string
): string | undefined {
  const unit = units.find((r) => r.id === id);
  if (unit) {
    const user = users.find((user) => user.uid === unit.ownerId);
    if (user) {
      return user.firstName;
    }
  }
  return undefined;
}
export function getUnitName(units: IUnit[], id: string): string | undefined {
  const myUnit = units.find((u) => u.id === id);
  if (myUnit) {
    return "Unit " + myUnit.unitName;
  } else {
    return "No Unit Number";
  }
}

export function getUnitsRequestOwner(
  users: IUser[],
  units: IUnit[],
  id: string
): string | undefined {
  const unit = units.find((r) => r.id === id);
  if (unit) {
    const user = users.find((user) => user.uid === unit.ownerId);
    if (user) {
      return user.firstName + " " + user.lastName;
    }
  }
  return undefined;
}

export function formatMeetingTime(
  startTimestamp: string,
  endTimestamp: string
) {
  const currentDate = new Date();
  const startTime = new Date(startTimestamp);
  const endTime = new Date(endTimestamp);

  const timeDifferenceStart = startTime.getTime() - currentDate.getTime();
  const timeDifferenceEnd = currentDate.getTime() - endTime.getTime();

  if (timeDifferenceStart > 0) {
    // Meeting is in the future
    const minutesLeft = Math.floor(timeDifferenceStart / (1000 * 60));
    if (minutesLeft < 60) {
      return `Meeting Starts in ${minutesLeft} minute${
        minutesLeft !== 1 ? "s" : ""
      } `;
    } else if (minutesLeft < 1440) {
      const hoursLeft = Math.floor(minutesLeft / 60);
      return `Meeting Starts in ${hoursLeft} hour${
        hoursLeft !== 1 ? "s" : ""
      } `;
    } else if (minutesLeft < 43200) {
      // 43200 minutes in a month (assuming 30 days in a month)
      const daysLeft = Math.floor(minutesLeft / 1440);
      return `Meeting Starts in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;
    } else if (minutesLeft < 525600) {
      // 525600 minutes in a year (assuming 365 days in a year)
      const monthsLeft = Math.floor(minutesLeft / 43200);
      return `Meeting Starts in ${monthsLeft} month${
        monthsLeft !== 1 ? "s" : ""
      } `;
    } else {
      const yearsLeft = Math.floor(minutesLeft / 525600);
      return `Meeting Starts in ${yearsLeft} year${
        yearsLeft !== 1 ? "s" : ""
      } left`;
    }
  } else if (timeDifferenceEnd > 0) {
    // Meeting has ended
    const minutesAgo = Math.floor(timeDifferenceEnd / (1000 * 60));
    if (minutesAgo < 60) {
      return `Meeting Ended ${minutesAgo} minute${
        minutesAgo !== 1 ? "s" : ""
      } ago`;
    } else if (minutesAgo < 1440) {
      const hoursAgo = Math.floor(minutesAgo / 60);
      return `Meeting Ended ${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
    } else if (minutesAgo < 43200) {
      // 43200 minutes in a month (assuming 30 days in a month)
      const daysAgo = Math.floor(minutesAgo / 1440);
      return `Meeting Ended ${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;
    } else if (minutesAgo < 525600) {
      // 525600 minutes in a year (assuming 365 days in a year)
      const monthsAgo = Math.floor(minutesAgo / 43200);
      return `Meeting Ended ${monthsAgo} month${
        monthsAgo !== 1 ? "s" : ""
      } ago`;
    } else {
      const yearsAgo = Math.floor(minutesAgo / 525600);
      return `Meeting Ended ${yearsAgo} year${yearsAgo !== 1 ? "s" : ""} ago`;
    }
  } else {
    // Meeting is currently ongoing
    return "Meeting is in progress";
  }
}

export function isDateAfterCurrentDate(dateString: string) {
  const providedDate = new Date(dateString);
  const currentDate = new Date();

  return providedDate < currentDate;
}

export function getQuoteFilesLength(
  workOrderFlowId: string,
  workOrderFlows: IWorkOrderFlow[]
): number {
  const workOrder = workOrderFlows.find(
    (order) => order.id === workOrderFlowId
  );

  if (workOrder && workOrder.quoteFiles) {
    return workOrder.quoteFiles.length;
  } else if (workOrder && workOrder.quoteFiles.length === 0) {
    return 0;
  } else {
    return 0; // Default to 0, modify as needed
  }
}

export function displayUserStatus(
  userId: string,
  currentLoggedInUserId: string,
  users: IUser[]
) {
  const organizerUser = users.find((user) => user.uid === userId);

  if (userId === currentLoggedInUserId) {
    return "ME";
  } else {
    return organizerUser
      ? `${organizerUser.firstName} ${organizerUser.lastName}`
      : "";
  }
}

export function cannotUpdate(status: string): boolean {
  if (status === "Done") {
    return true;
  } else {
    return false;
  }
}

export function cannotCreateOrder(orders: IWorkOrderFlow[]): boolean {
  for (const order of orders) {
    if (order.status === "Done") {
      return true;
    }
  }
  return false;
}

export const generateMaintenanceRequestReference = (identity: string) => {
  const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
  const formattedNumber = randomNumber.toString().padStart(4, "0"); // Pad the number with leading zeros if necessary
  const generatedInvoiceNumber = `${identity}${formattedNumber}`; // Add the prefix "INV" to the number
  return generatedInvoiceNumber;
};

export async function updateById(
  requestId: string,
  pid: string,
  newStatus: string
) {
  const myPath = `BodyCoperate/${pid}/MaintenanceRequest`;

  try {
    // Get the current document data before the update
    const docSnapshot = await getDoc(doc(db, myPath, requestId));
    await updateDoc(doc(db, myPath, requestId), {
      // your update data here
      status: newStatus,
    });
    const updatedDocSnapshot = await getDoc(doc(db, myPath, requestId));
    const updatedData = updatedDocSnapshot.data();
    console.log("Updated Data:", updatedData);
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

export async function updateWorkOrderById(
  workOrderId: string,
  pid: string,
  mid: string,
  newQuoteFile: { id: string; quoteFileurl: string; imageUrls: string[] },
  newImages: File[]
) {
  const myPath = `BodyCoperate/${pid}/MaintenanceRequest/${mid}/WorkFlowOrder`;

  try {
    // Create a reference for the document
    const workOrderRef = doc(db, myPath, workOrderId);

    // Get the current document data before the update
    const docSnapshot = await getDoc(workOrderRef);
    const currentData = docSnapshot.data();

    // Convert quoteFileurl content to a Blob
    const quoteFileBlob = new Blob([newQuoteFile.quoteFileurl]);

    // Upload new quote file to Firebase Storage and get its download URL
    //   const quoteFilePath = `workOrderFiles/${workOrderId}/${newQuoteFile.id}`;
    //   const quoteFileRef = ref(storage, quoteFilePath);
    const fileExtension = newQuoteFile.id.split(".").pop(); // Get the file extension
    const quoteFilePath = `workOrderFiles/${workOrderId}/${newQuoteFile.id}.${fileExtension}`;
    const quoteFileRef = ref(storage, quoteFilePath);

    // Upload quote file to storage
    await uploadBytes(quoteFileRef, quoteFileBlob);

    // Get download URL for the quote file
    const quoteFileDownloadURL = await getDownloadURL(quoteFileRef);

    // Upload new images to Firebase Storage and get their download URLs
    const uploadPromises = newImages.map(async (image) => {
      const imagePath = `workOrderFiles/${workOrderId}/${image.name}`;
      const imageRef = ref(storage, imagePath);

      // Upload image to storage
      await uploadBytes(imageRef, image);

      // Get download URL for the image
      const downloadURL = await getDownloadURL(imageRef);

      return downloadURL;
    });

    const newImageURLs = await Promise.all(uploadPromises);

    // Update the document in Firestore to add new quote file and images to the existing array
    await updateDoc(workOrderRef, {
      quoteFiles: arrayUnion({
        id: newQuoteFile.id,
        quoteFileurl: quoteFileDownloadURL,
        imageUrls: newImageURLs,
      }),
    });

    // Get the updated document data
    const updatedDocSnapshot = await getDoc(workOrderRef);
    const updatedData = updatedDocSnapshot.data();
    console.log("Updated Data:", updatedData);
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

export async function workerOrdersAndRequestRelationshipStatusUpdate(
  requestId: string,
  pid: string,
  newStatus: string
) {
  const workOrderPath = `BodyCoperate/${pid}/MaintenanceRequest/${requestId}/WorkFlowOrder`;
  const requestPath = `BodyCoperate/${pid}/MaintenanceRequest`;

  try {
    // Fetch all work order documents
    const workOrderQuery = query(
      collection(db, workOrderPath),
      where("status", "!=", "Done") // Filter work orders that are not Done
    );

    const workOrderSnapshot = await getDocs(workOrderQuery);

    // Check if there are any work orders that are not Done
    if (workOrderSnapshot.size > 0) {
      console.log(
        "Not all work orders are done. Request status will not be updated."
      );
      return;
    }

    // All work orders are done, proceed to update the request status
    const docSnapshot = await getDoc(doc(db, requestPath, requestId));
    await updateDoc(doc(db, requestPath, requestId), {
      status: newStatus,
    });

    const updatedDocSnapshot = await getDoc(doc(db, requestPath, requestId));
    const updatedData = updatedDocSnapshot.data();
    console.log("Updated Data:", updatedData);
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

export function cannotCreateFolder(role: string): boolean {
  if (role === "Owner") {
    return false;
  } else {
    return true;
  }
}
export function cannotCreateMeeting(role: string): boolean {
  if (role === "Owner") {
    return false;
  } else {
    return true;
  }
}
export function cannotCreateAttachDocuments(role: string): boolean {
  if (role === "Owner") {
    return false;
  } else {
    return true;
  }
}
export function cannotEditMeeting(role: string): boolean {
  if (role === "Owner") {
    return false;
  } else {
    return true;
  }
}

export function cannotViewMaintenanceGrid(role: string): boolean {
  if (role === "Owner") {
    return false;
  } else {
    return true;
  }
}
export function cannotCreateNotices(role: string): boolean {
  if (role === "Owner") {
    return false;
  } else {
    return true;
  }
}
export function cannotCreateSP(role: string): boolean {
  if (role === "Owner") {
    return false;
  } else {
    return true;
  }
}
export function cannotCreateMeetingFolder(role: string): boolean {
  if (role === "Owner") {
    return false;
  } else {
    return true;
  }
}
export function cannotCreateDocumentFolder(role: string): boolean {
  if (role === "Owner") {
    return false;
  } else {
    return true;
  }
}

export function getOwnersEmail(
  users: IUser[],
  uid: string
): string | undefined {
  const email = users.find((u) => u.uid === uid)?.email;

  if (email) {
    return email;
  } else {
    return undefined;
  }
}

export function findPropertyUsersEmails(
  owners: IUser[],
  units: IUnit[]
): string[] {
  const _owners = owners.filter((u) => u.role === "Owner").map((u) => u);
  const _units = units.map((u) => {
    return u;
  });
  const propertyUsers = _owners
    .filter((owner) => _units.some((unit) => unit.ownerId === owner.uid))
    .map((owner) => owner.email);
  return propertyUsers;
}

export function findPropertyUsers(
  owners: any[],
  units: IUnit[]
): { value: string; label: string }[] {
  const _owners = owners.filter((u) => u.role === "Owner").map((u) => u);
  const _units = units.map((u) => ({ ...u })); // Shallow copy of units

  const propertyUsers = _owners
    .filter((owner) => _units.some((unit) => unit.ownerId === owner.uid))
    .map((owner) => ({
      value: owner.uid,
      label: owner.firstName + " " + owner.lastName,
    }));

  return propertyUsers;
}

export function canViewPropertyDetails(
  ownerId: string,
  units: IUnit[]
): boolean {
  // Check if there is at least one unit with the specified ownerId
  const hasUnit = units.some((unit) => unit.ownerId === ownerId);

  // Return true if at least one unit is found, otherwise return false
  return hasUnit;
}

export function canViewMaintenanceRequestDetails(
  serviceProviderId: string,
  maintenanceRequest: IMaintenanceRequest[]
): boolean {
  // Check if there is at least one unit with the specified ownerId
  const hasMaintenanceRequest = maintenanceRequest.some(
    (request) => request.serviceProviderId === serviceProviderId
  );

  // Return true if at least one unit is found, otherwise return false
  return hasMaintenanceRequest;
}



