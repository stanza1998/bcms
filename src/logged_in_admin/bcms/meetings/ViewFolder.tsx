import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import showModalFromId from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../dialogs/Dialogs";
import Modal from "../../../shared/components/Modal";
import { MeetingDialog } from "../../dialogs/communication-dialogs/meetings/MeetingDialog";
import { IMeeting } from "../../../shared/models/communication/meetings/Meeting";
import { EditMeetingDialog } from "../../dialogs/communication-dialogs/meetings/EditMeetingDialog";
import "./meeting-card.scss";
import { formatMeetingTime } from "../../shared/common";
import Loading from "../../../shared/components/Loading";

export const ViewFolder = observer(() => {
  const { store, api } = useAppContext();
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const me = store.user.meJson;

  const _folder = store.communication.meetingFolder.getById(folderId || "");

  const foundUser = store.user.all.find((user) => user.uid === me?.uid);

  let displayName = "";
  if (me && foundUser && me?.uid === foundUser.uid) {
    displayName = "ME";
  } else if (foundUser) {
    displayName = foundUser.firstName + " " + foundUser.lastName;
  }

  const meetings = store.communication.meeting.all
    .filter((m) => m.asJson.folderId === folderId)
    .map((m) => {
      return m.asJson;
    });

  const back = () => {
    navigate("/c/communication/meetings");
  };

  const onCreateMeeting = () => {
    showModalFromId(DIALOG_NAMES.COMMUNICATION.CREATE_MEETING_DIALOG);
  };

  const onViewMeeting = (meeting: IMeeting) => {
    store.communication.meeting.select(meeting);
    showModalFromId(DIALOG_NAMES.COMMUNICATION.EDIT_MEETING_DIALOG);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (me?.property && folderId) {
        await api.communication.meetingFolder.getById(folderId, me.property);
        await api.communication.meeting.getAll(me.property, folderId);
      }
      setLoading(false);
    };
    getData();
  }, [
    api.communication.meeting,
    api.communication.meetingFolder,
    folderId,
    me?.property,
  ]);

  const sortedMeetings: IMeeting[] = meetings.sort(
    (a, b) =>
      new Date(b.startDateAndTime).getTime() -
      new Date(a.startDateAndTime).getTime()
  );

  // Create an object to store grouped meetings by year and month
  const groupedMeetings: Record<string, IMeeting[]> = {};

  // Group meetings by year and month
  sortedMeetings.forEach((meeting) => {
    const year = new Date(meeting.startDateAndTime).getFullYear();
    const month = new Date(meeting.startDateAndTime).getMonth() + 1; // Month is zero-based, so add 1
    const key = `${year}-${month}`;

    if (!groupedMeetings[key]) {
      groupedMeetings[key] = [];
    }

    groupedMeetings[key].push(meeting);
  });

  return (
    <div className="uk-section leave-analytics-page">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="uk-container uk-container-large">
            <div className="section-toolbar uk-margin">
              <h4 className="section-heading uk-heading">
                {_folder?.asJson.folderName} Folder
              </h4>
              <div className="controls">
                <div className="uk-inline">
                  <button
                    onClick={onCreateMeeting}
                    className="uk-button primary uk-margin-right"
                    type="button"
                  >
                    New Meeting
                  </button>
                  <button
                    onClick={back}
                    className="uk-button primary"
                    type="button"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
            <div className="meeting-card">
              {Object.entries(groupedMeetings).map(([key, meetingsGroup]) => (
                <div key={key} className="uk-margin">
                  <span className="uk-margin">
                    {new Date(key).toLocaleString("default", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                  <div
                    className="uk-child-width-1-3@m uk-grid-small uk-grid-match uk-margin"
                    data-uk-grid
                  >
                    {meetingsGroup.map((meeting) => {
                      const now = new Date();
                      const isScheduled =
                        now.getTime() <
                        new Date(meeting.startDateAndTime).getTime();
                      const isInProgress =
                        now.getTime() >=
                          new Date(meeting.startDateAndTime).getTime() &&
                        now.getTime() <=
                          new Date(meeting.endDateAndTime).getTime();
                      const statusText = isScheduled
                        ? "Scheduled"
                        : isInProgress
                        ? "In Progress"
                        : "Done";
                      const statusClass = statusText
                        .toLowerCase()
                        .replace(/\s+/g, "-"); // Convert status text to CSS class

                      return (
                        <div
                          key={meeting.id}
                          style={{ cursor: "pointer", position: "relative" }}
                          data-uk-tooltip="Double click to view"
                          onDoubleClick={() => onViewMeeting(meeting)}
                        >
                          <div className="uk-card uk-card-default uk-card-body">
                            <span
                              style={{
                                background: "lightgrey",
                                padding: "5px",
                                color: "black",
                                borderRadius: "3px",
                              }}
                              className="top-left-span"
                            >
                              Created By {displayName}
                            </span>
                            <span className={`status-indicator ${statusClass}`}>
                              {statusText}
                            </span>
                            <h3 className="uk-card-title">{meeting.title}</h3>
                            <p>{meeting.description}</p>
                            <span
                              className="bottom-right-span"
                              style={{
                                background: "lightgrey",
                                padding: "5px",
                                color: "black",
                                borderRadius: "3px",
                              }}
                            >
                              {formatMeetingTime(
                                meeting.startDateAndTime,
                                meeting.endDateAndTime
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Modal modalId={DIALOG_NAMES.COMMUNICATION.CREATE_MEETING_DIALOG}>
            <MeetingDialog />
          </Modal>
          <Modal modalId={DIALOG_NAMES.COMMUNICATION.EDIT_MEETING_DIALOG}>
            <EditMeetingDialog />
          </Modal>
        </>
      )}
    </div>
  );
});
