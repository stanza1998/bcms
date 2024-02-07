import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../stores/AppStore";

export const defaultMeeting: IMeeting = {
    id: "",
    dateCreate: "",
    folderId: "",
    title: "",
    startDateAndTime: "",
    endDateAndTime: "",
    description: "",
    location: "",
    meetingLink: "",
    organizer: "",
    status: "Scheduled",
    meetingNote: "",
    priority: "",
    attachments: [],
    ownerParticipants: [],
    externalParticipants: [],
    isVerified: false,
    seen:[],
};

export interface IMeeting {
    id: string;
    dateCreate: string;
    folderId: string;
    title: string;
    startDateAndTime: string;
    endDateAndTime: string;
    attachments: string[];
    description: string;
    location: string;
    organizer: string;
    status: string;
    ownerParticipants: string[];
    externalParticipants: string[];
    meetingNote: string;
    priority: string;
    meetingLink: string;
    isVerified:boolean;
    seen:string[];
}

export interface IOwnerParticipants {
    id: string;
    ownerName: string;
    emailAddress: string;
}
export interface IExternalParticipants {
    id: string;
    externalPersonName: string;
    emailAddress: string;
}


export default class MeetingModel {
    private meeting: IMeeting;

    constructor(private store: AppStore, meeting: IMeeting) {
        makeAutoObservable(this);
        this.meeting = meeting;
    }

    get asJson(): IMeeting {
        return toJS(this.meeting);
    }
}
