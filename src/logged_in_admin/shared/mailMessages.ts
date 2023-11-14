var today: Date = new Date();
var currentHour: number = today.getHours();
var greeting: string = "";
const link: string = "https//vanwylbcms.web.app";
const username: string = "Van Wyk Realtor Property Management System";

if (currentHour < 12) {
    greeting = "Good Morning";
} else if (currentHour < 18) {
    greeting = "Good Afternoon";
} else {
    greeting = "Good Evening";
}


export const MAIL_ANNOUNCEMENTS = (
    title: string | null | undefined,
    message: string | null | undefined
) => {
    const MY_SUBJECT = `${title}`
    const MY_BODY = [
        `${greeting}`,
        "",
        `${message}`,
        "",
        "Regards,",
        `${username}`,
        "",
        `${link}`
    ];

    return {
        MY_SUBJECT: MY_SUBJECT,
        MY_BODY: MY_BODY.join("<br/>")
    };
};


export const MAIL_SERVICE_PROVIDER_LINK = (
    title: string | null | undefined,
    message: string | null | undefined,
    spLink: string | null | undefined
) => {
    const MY_SUBJECT = `${title}`
    const MY_BODY = [
        `${greeting}`,
        "",
        `${message}`,
        "",
        "Please click the link below to upload your quotation.",
        `${spLink}`,
        "",
        "Regards,",
        `${username}`,
        "",
        `${link}`
    ];

    return {
        MY_SUBJECT: MY_SUBJECT,
        MY_BODY: MY_BODY.join("<br/>")
    }
}

export const MAIL_MEETINGS = (
    title: string | null | undefined,
    message: string | null | undefined,
    startDate: string | null | undefined,
    meeting_location: string | null | undefined,
    meeting_link: string | null | undefined
) => {
    const MY_SUBJECT = `${title}`
    const MY_BODY = [
        `${greeting}`,
        "",
        `${message}`,
        "",
        `The commencement of the meeting was scheduled for ${startDate}.`,
        // Conditionally include Location if not empty
        ...(meeting_location ? [`Location: ${meeting_location}`] : []),
        // Conditionally include Meeting Link if not empty
        ...(meeting_link ? [`Meeting Link: ${meeting_link}`] : []),
        "",
        "Regards,",
        `${username}`,
        "",
        `${link}`
    ];
    return {
        MY_SUBJECT: MY_SUBJECT,
        MY_BODY: MY_BODY.join("<br/>")
    };
}


