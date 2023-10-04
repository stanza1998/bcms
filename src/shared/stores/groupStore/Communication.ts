import AppStore from "../AppStore";
import AnnouncementStore from "../individualStore/communication/announcements/AnnouncementStore";

export default class CommunicationStore {
  announcements: AnnouncementStore;

  constructor(store: AppStore) {
    this.announcements = new AnnouncementStore(store);
  }
}
