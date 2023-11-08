import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../stores/AppStore";

export const defaultMeetingFolder: IMeetingFolder = {
  id: "",
  folderName: ""
};

export interface IMeetingFolder {
  id: string;
  folderName: string
}

export default class MeetingFolderModel {
  private folder: IMeetingFolder;

  constructor(private store: AppStore, folder: IMeetingFolder) {
    makeAutoObservable(this);
    this.folder = folder;
  }

  get asJson(): IMeetingFolder {
    return toJS(this.folder);
  }
}
