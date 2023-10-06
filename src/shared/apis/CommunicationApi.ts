import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import AnnouncementApi from "./communication/announcements/AnnouncementApi";
import CustomContactApi from "./communication/custom-contacts/CustomContactApi";
import PrivateMessageApi from "./communication/private-message/PrivateMessageApi";

export default class CommunicationApi {
  announcement: AnnouncementApi;
  customContact: CustomContactApi;
  privateMessage: PrivateMessageApi;

  constructor(api: AppApi, store: AppStore) {
    this.announcement = new AnnouncementApi(api, store);
    this.customContact = new CustomContactApi(api, store);
    this.privateMessage = new PrivateMessageApi(api, store);
  }
}
