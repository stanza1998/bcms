import AppStore from "../AppStore";
import AnnouncementStore from "../individualStore/communication/announcements/AnnouncementStore";
import CustomContactStore from "../individualStore/communication/custom-contacts/CustomContacts";
import DocumentCategoryStore from "../individualStore/communication/documents/DocumentCategoryStore";
import DocumentFileStore from "../individualStore/communication/documents/DocumentFileStore";
import MeetingFolderStore from "../individualStore/communication/meetings/MeetingFolderStore";
import MeetingStore from "../individualStore/communication/meetings/MeetingsStore";
import PrivateMessageStore from "../individualStore/communication/private-message/PrivateMessageStore";

export default class CommunicationStore {
  announcements: AnnouncementStore;
  customContacts: CustomContactStore;
  privateMessage: PrivateMessageStore;
  meetingFolder: MeetingFolderStore;
  meeting: MeetingStore;
  documentCategory: DocumentCategoryStore;
  documentFile: DocumentFileStore;

  constructor(store: AppStore) {
    this.announcements = new AnnouncementStore(store);
    this.customContacts = new CustomContactStore(store);
    this.privateMessage = new PrivateMessageStore(store);
    this.meetingFolder = new MeetingFolderStore(store);
    this.meeting = new MeetingStore(store);
    this.documentCategory = new DocumentCategoryStore(store);
    this.documentFile = new DocumentFileStore(store);
  }
}
