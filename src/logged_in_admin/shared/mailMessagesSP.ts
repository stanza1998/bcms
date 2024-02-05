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


export async function mailServiceProvider(to: string[], workOrder: string, message: string, spLink: string) {
    try {
        const emailInfo = {
            to: to,
            from: "narib09jerry@gmail.com",
            subject: workOrder,
            text: ` ${greeting},

    Description: ${message}
      
    Please click the link below to upload your quotation.
    ${spLink}
      
    Kind regards,
    ${username}`,
        };
        const response = await fetch('https://us-central1-vanwylbcms.cloudfunctions.net/sendEmails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailInfo),
        });

        if (response.ok) {
            console.log('Email sent successfully');
        } else {
            console.error('Error sending email:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
};