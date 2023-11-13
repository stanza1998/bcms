import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "./calendarStyles/styles.scss";
import showModalFromId from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../dialogs/Dialogs";
import {
  IMeeting,
  defaultMeeting,
} from "../../../shared/models/communication/meetings/Meeting";
import Modal from "../../../shared/components/Modal";
import { EditMeetingDialog } from "../../dialogs/communication-dialogs/meetings/EditMeetingDialog";


export const CalendarView = observer(() => {
  const { api, store } = useAppContext();
  const me = store.user.meJson;
  const { folderId } = useParams();

  useEffect(() => {
    const getMeetings = async () => {
      if (me?.property && folderId) {
        await api.communication.meeting.getAll(me.property, folderId);
      }
    };
    getMeetings();
  }, [api.communication.meeting, folderId, me?.property]);

  const meetings = store.communication.meeting.all
    .filter((m) => m.asJson.folderId === folderId)
    .map((m) => {
      const startDate = new Date(m.asJson.startDateAndTime);
      const endDate = new Date(m.asJson.endDateAndTime);
      const currentTime = new Date();

      let eventStyle = {};

      if (currentTime < startDate) {
        eventStyle = { backgroundColor: "orange" };
      } else if (currentTime >= startDate && currentTime <= endDate) {
        eventStyle = { backgroundColor: "blue" };
      } else if (currentTime > endDate) {
        eventStyle = { backgroundColor: "green" };
      }

      return {
        title: m.asJson.title,
        start: new Date(m.asJson.startDateAndTime),
        end: new Date(m.asJson.endDateAndTime),
        style: eventStyle,
        id: m.asJson.id,
        dateCreate: m.asJson.dateCreate,
        folderId: m.asJson.folderId,
        attachments: m.asJson.attachments.map((a) => a),
        ownerParticipants: m.asJson.ownerParticipants.map((a) => a),
        externalParticipants: m.asJson.externalParticipants.map((a) => a),
        description: m.asJson.description,
        location: m.asJson.location,
        organizer: m.asJson.organizer,
        status: m.asJson.status,
        meetingNote: m.asJson.meetingNote,
        priority: m.asJson.priority,
        meetingLink: m.asJson.meetingLink,
      };
    });

  const localizer = momentLocalizer(moment);

  const onViewDetails = (meeting: IMeeting) => {
    store.communication.meeting.select(meeting);
    showModalFromId(DIALOG_NAMES.COMMUNICATION.EDIT_MEETING_DIALOG);
  };

  const handleSelectEvent = (event: any, e: any) => {
    const selectedMeeting: IMeeting = {
      title: event.title,
      startDateAndTime: event.start.toISOString().slice(0, 16),
      endDateAndTime: event.end.toISOString().slice(0, 16),
      id: event.id,
      dateCreate: event.dateCreate,
      folderId: event.folderId,
      attachments: event.attachments,
      description: event.description,
      location: event.location,
      organizer: event.organizer,
      status: event.status,
      ownerParticipants: event.ownerParticipants,
      externalParticipants: event.externalParticipants,
      meetingNote: event.meetingNote,
      priority: event.priority,
      meetingLink: event.meetingLink,
    };
    onViewDetails(selectedMeeting);
  };

  return (
    <>
      <div>
        <Calendar
          localizer={localizer}
          events={meetings}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={(event, start, end, isSelected) => ({
            style: event.style,
          })}
          onSelectEvent={handleSelectEvent}
        />
      </div>

      <Modal modalId={DIALOG_NAMES.COMMUNICATION.EDIT_MEETING_DIALOG}>
        <EditMeetingDialog />
      </Modal>
    </>
  );
});
