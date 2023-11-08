import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import AnnouncementApi from "./communication/announcements/AnnouncementApi";
import CustomContactApi from "./communication/custom-contacts/CustomContactApi";
import MeetingFolderApi from "./communication/meetings/MeetingFolderApi";
import MeetingApi from "./communication/meetings/MeetingsApi";
import PrivateMessageApi from "./communication/private-message/PrivateMessageApi";

export default class CommunicationApi {
  announcement: AnnouncementApi;
  customContact: CustomContactApi;
  privateMessage: PrivateMessageApi;
  meetingFolder: MeetingFolderApi;
  meeting: MeetingApi;

  constructor(api: AppApi, store: AppStore) {
    this.announcement = new AnnouncementApi(api, store);
    this.customContact = new CustomContactApi(api, store);
    this.privateMessage = new PrivateMessageApi(api, store);
    this.meetingFolder = new MeetingFolderApi(api, store);
    this.meeting = new MeetingApi(api, store);
  }
}
