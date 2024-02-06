var today: Date = new Date();
var currentHour: number = today.getHours();
var greeting: string = "";

if (currentHour < 12) {
    greeting = "Good Morning";
} else if (currentHour < 18) {
    greeting = "Good Afternoon";
} else {
    greeting = "Good Evening";
}

export async function mailMaintenanceRequestCreatedSuccessfulManager(to: string[], message: string, ownerName: string) {
    try {
        const emailInfo = {
            to: to,
            from: "narib09jerry@gmail.com",
            subject: "New Request Logged",
            text: ` ${greeting},

    Owner: ${ownerName}

    Request: ${message}
      
    Kind regards,
    Body Corporate Management System`,
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
