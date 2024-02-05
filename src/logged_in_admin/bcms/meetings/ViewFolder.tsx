import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import showModalFromId from "../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../dialogs/Dialogs";
import Modal from "../../../shared/components/Modal";
import { MeetingDialog } from "../../dialogs/communication-dialogs/meetings/MeetingDialog";
import {
  IMeeting,
  defaultMeeting,
} from "../../../shared/models/communication/meetings/Meeting";
import { EditMeetingDialog } from "../../dialogs/communication-dialogs/meetings/EditMeetingDialog";
import "./meeting-card.scss";
import {
  cannotCreateFolder,
  cannotCreateMeeting,
  displayUserStatus,
  formatMeetingTime,
} from "../../shared/common";
import Loading from "../../../shared/components/Loading";
import { Tab } from "../../../Tab";
import { CalendarView } from "./CalendarView";
import Pagination from "../../shared/PaginationComponent";

export const ViewFolder = observer(() => {
  const { store, api } = useAppContext();
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const me = store.user.meJson;
  const [searchTerm, setSearchTerm] = useState<string>("");

  const _folder = store.communication.meetingFolder.getById(folderId || "");

  const meetings = store.communication.meeting.all
    .filter((m) => m.asJson.folderId === folderId)
    .map((m) => m.asJson);

  // Assuming there is an 'organizer' field in each meeting object
  const users = store.user.all;

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

  const [activeTab, setActiveTab] = useState("card");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust as needed

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(sortedMeetings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const lowercaseSearchTerm = searchTerm.toLowerCase();

  const filteredMeetings = sortedMeetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(lowercaseSearchTerm)
  );

  const currentMeetings = filteredMeetings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
                  {cannotCreateMeeting(me?.role || "") && (
                    <button
                      onClick={onCreateMeeting}
                      className="uk-button primary uk-margin-right"
                      type="button"
                    >
                      New Meeting
                    </button>
                  )}
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
            <div>
              <div
                style={{ padding: "10px" }}
                className="uk-margin  uk-card-default"
              >
                <Tab
                  label="Grid View"
                  isActive={activeTab === "card"}
                  onClick={() => handleTabClick("card")}
                />
                <Tab
                  label="Calendar View"
                  isActive={activeTab === "calendar"}
                  onClick={() => handleTabClick("calendar")}
                />

                {/* <Tab
                  label="List View"
                  isActive={activeTab === "list"}
                  onClick={() => handleTabClick("list")}
                /> */}
              </div>
              <div className="uk-margin">
                <div className="uk-margin">Search Meeting</div>
                <div className="uk-margin">
                  <input
                    className="uk-input"
                    placeholder="Search for a Meeting"
                    style={{ width: "60%" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="tab-content">
                {activeTab === "card" && (
                  <div className="meeting-card">
                    <div
                      className="uk-child-width-1-3@m uk-grid-small uk-grid-match uk-margin"
                      data-uk-grid
                    >
                      {currentMeetings.map((meeting) => {
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

                        // Render the meeting card if the user is not an owner or if the meeting is verified
                        // If the user is an owner, only render the card if the meeting is verified
                        if (me?.role !== "Owner" || meeting.isVerified) {
                          return (
                            <div
                              key={meeting.id}
                              style={{
                                cursor: "pointer",
                                position: "relative",
                              }}
                              onClick={() => onViewMeeting(meeting)}
                            >
                              <div
                                className="uk-card uk-card-default uk-card-body"
                                style={{ background: "white" }}
                              >
                                <span
                                  style={{
                                    background: "#01aced",
                                    padding: "5px",
                                    color: "white",
                                    borderRadius: "3px",
                                  }}
                                  className="top-left-span"
                                >
                                  Created By{" "}
                                  {displayUserStatus(
                                    meeting.organizer,
                                    me?.uid || "",
                                    users
                                  )}
                                </span>
                                <span
                                  className={`status-indicator ${statusClass}`}
                                >
                                  {statusText}
                                </span>
                                <h3
                                  className="uk-card-title"
                                  style={{ color: "#000" }}
                                >
                                  {meeting.title}
                                </h3>
                                <p style={{ color: "black" }}>
                                  {meeting.description}
                                </p>
                                <span
                                  className="bottom-right-span"
                                  style={{
                                    background: "#01aced",
                                    padding: "5px",
                                    color: "white",
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
                        } else {
                          return null; // Don't render the meeting card
                        }
                      })}
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
                {activeTab === "calendar" && <CalendarView />}
              </div>
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
