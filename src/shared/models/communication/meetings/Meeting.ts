import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../../stores/AppStore";

export const defaultMeeting: IMeeting = {
    id: "",
    folderId: "",
    title: "",
    startDateAndTime: "",
    endDateAndTime: "",
    description: "",
    location: "",
    meetingLink: "",
    organizer: "",
    status: "Scheduled",
    ownerParticipants: [{
        ownerName: "",
        emailAddress: ""
    }],
    externalParticipants: [{
        externalPersonName: "",
        emailAddress: ""
    }],
    meetingNote: "",
    priority: "",
    attachments: [],
};

export interface IMeeting {
    id: string;
    folderId: string;
    title: string;
    startDateAndTime: string;
    endDateAndTime: string;
    attachments: string[];
    description: string;
    location: string;
    organizer: string;
    status: string;
    ownerParticipants: IOwnerParticipants[];
    externalParticipants: IExternalParticipants[];
    meetingNote: string;
    priority: string;
    meetingLink: string;
}

interface IOwnerParticipants {
    ownerName: string;
    emailAddress: string;
}
interface IExternalParticipants {
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
