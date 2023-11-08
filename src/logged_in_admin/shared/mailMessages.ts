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