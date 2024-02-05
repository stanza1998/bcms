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

//notices
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






//meetings

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







//maintenance SP
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


export const MAIL_SUCCESSFULL_SERVICE_PROVIDER = (
    workOrderId: string | null | undefined,
    description: string | null | undefined,
    dueDate: string | null | undefined
) => {
    const MY_SUBJECT = `Work Order Awarded`
    const MY_BODY = [
        `${greeting}`,
        "",
        "Congratulations! You have been awarded a new work order. Here are the details:",
        "",
        `Work Order ID: ${workOrderId}`,
        `Description: ${description}`,
        `Due Date: ${dueDate}`,
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



export const MAIL_WORK_ORDER_WINDOW_PERIOD_EXTENDED = (
    workOrderId: string | null | undefined,
    windowDate: string | null | undefined,
    spLink: string | null | undefined
) => {
    const MY_SUBJECT = `Work Order Window Period Extended`
    const MY_BODY = [
        `${greeting}`,
        "",
        `Work Order ID: ${workOrderId}`,
        "",
        `The Work Order Window Period has been extended. The new deadline is ${new Date(windowDate || "").toDateString()} ${new Date(windowDate || "").toTimeString()}. Please ensure timely submission.`,
        "",
        "Please use the following link below to upload your documents",
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


//1. WHEN OWNER CREATES A REQUEST
export const MAIL_MAINTENANCE_REQUEST_CREATED_SUCCESSFULLY_OWNER = (
) => {
    const MY_SUBJECT = `New Request Logged`
    const MY_BODY = [
        `${greeting}`,
        "",
        `You have successfully logged a new Maintenance request`,
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
export const MAIL_MAINTENANCE_REQUEST_CREATED_SUCCESSFULLY_MANAGER = (
    message:string,
    ownerName:string,
) => {
    const MY_SUBJECT = `New Request Logged`
    const MY_BODY = [
        `${greeting}`,
        "",
        `Owner: ${ownerName}`,
        "",
        `Request: ${message}`,
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


//owners notifications maintenance
//2. WHEN MANAGER CREATES A REQUEST FOR THEM
export const MAIL_MAINTENANCE_REQUEST_CREATED_SUCCESSFULLY_LOGGED = (
    description: string | null | undefined,
    managerName: string | null | undefined,

) => {
    const MY_SUBJECT = `Your Maintenance Request Logged Successfully`
    const MY_BODY = [
        `${greeting}`,
        "",
        `Description: ${description}`,
        "",
        "",
        `Your Maintenance Request was Logged Successfully by ${managerName}.`,
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





