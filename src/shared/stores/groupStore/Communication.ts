import AppStore from "../AppStore";
import AnnouncementStore from "../individualStore/communication/announcements/AnnouncementStore";
import CustomContactStore from "../individualStore/communication/custom-contacts/CustomContacts";

export default class CommunicationStore {
  announcements: AnnouncementStore;
  customContacts: CustomContactStore;

  constructor(store: AppStore) {
    this.announcements = new AnnouncementStore(store);
    this.customContacts = new CustomContactStore(store);
  }
}
