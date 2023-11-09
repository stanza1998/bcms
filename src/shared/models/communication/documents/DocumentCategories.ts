import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../stores/AppStore";

export const defaultDocumentCategory: IDocumentCategory = {
    id: "",
    documentName: ""
};

export interface IDocumentCategory {
    id: string;
    documentName: string
}

export default class DocumentCategoryModel {
    private document: IDocumentCategory;

    constructor(private store: AppStore, document: IDocumentCategory) {
        makeAutoObservable(this);
        this.document = document;
    }

    get asJson(): IDocumentCategory {
        return toJS(this.document);
    }
}
