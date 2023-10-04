import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import AnnouncementApi from "./communication/announcements/AnnouncementApi";

export default class CommunicationApi {
    announcement: AnnouncementApi;


    constructor(api: AppApi, store: AppStore){
     this.announcement = new AnnouncementApi(api, store)
    }
}