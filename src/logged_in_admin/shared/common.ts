import { IExternalParticipants, IOwnerParticipants } from "../../shared/models/communication/meetings/Meeting";
import AppStore from "../../shared/stores/AppStore";
import csv from "./file-icons/csv (2).png"
import doc from "./file-icons/doc_4725970.png"
import docx from "./file-icons/docx_8361174.png"
import odp from "./file-icons/odp_10451906.png"
import odt from "./file-icons/odt_1975685.png"
import ods from "./file-icons/ods_9848919.png"
import pdf from "./file-icons/pdf_9496432.png"
import pptx from "./file-icons/pptx_10452012.png"
import ppt from "./file-icons/ppt_4726016.png"
import xls from "./file-icons/xls-file_9681350.png"
import _xlsx from "./file-icons/xlsx_8361467.png"
import d from "./file-icons/documentation_10517465.png"


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
    const extension = extensionMatch ? extensionMatch[1].toLowerCase() : '';

    switch (extension) {
        case 'pdf':
            return pdf;
        case 'doc':
            return doc;
        case 'docx':
            return docx;
        case 'xls':
            return xls;
        case 'xlsx':
            return _xlsx;
        case 'ppt':
            return ppt;
        case 'pptx':
            return pptx;
        case 'odt':
            return odt;
        case 'ods':
            return ods;
        case 'odp':
            return odp;
        case 'csv':
            return csv;
        default:
            return d;
    }
};



export const getIconForExtension = (extension: string): string => {
    switch (extension.toLowerCase()) {
        case 'pdf':
            return pdf;
        case 'doc':
            return doc;
        case 'docx':
            return docx;
        case 'xls':
            return xls;
        case 'xlsx':
            return _xlsx;
        case 'ppt':
            return ppt;
        case 'pptx':
            return pptx;
        case 'odt':
            return odt;
        case 'ods':
            return ods;
        case 'odp':
            return odp;
        case 'csv':
            return csv;
        default:
            return d;
    }
};

export function getUsersEmail(users: string[], store: AppStore): string[] {
    const usersEmails: string[] = users.map(user => {
        return store.user.getById(user)?.asJson.email || "";
    });
    return usersEmails;
}



export function getCustomUserEmail(customUser: string[], store: AppStore): string[] {
    const usersEmails: string[] = customUser.map(user => {
        return store.communication.customContacts.getById(user)?.asJson.email || "";
    });
    return usersEmails;
}

