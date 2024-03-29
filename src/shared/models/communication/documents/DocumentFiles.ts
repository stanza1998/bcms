import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../stores/AppStore";

export const defaultDocumentFile: IDocumentFile = {
    id: "",
    documentFileName: "",
    fileUrl: "",
    dateCreated: "",
    fid: "",
    seen:[],
};

export interface IDocumentFile {
    id: string;
    documentFileName: string;
    fileUrl: string;
    dateCreated: string;
    fid: string;
    seen:string[];
}

export default class DocumentFileModel {
    private documentFile: IDocumentFile;

    constructor(private store: AppStore, documentFile: IDocumentFile) {
        makeAutoObservable(this);
        this.documentFile = documentFile;
    }

    get asJson(): IDocumentFile {
        return toJS(this.documentFile);
    }
}
