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

//maintenance
//send
export async function OwnerAnnounceLogged(to: string[], firstName: string, lastName: String, description: string) {
    try {
        const emailInfo = {
            to: to,
            from: "narib09jerry@gmail.com",
            subject: "Your Maintenance Request Logged Successfully",
            text: `${greeting}
            
      Description: ${description},
      
      Your Maintenance Request was Logged Successfully by ${firstName + " " + lastName
                }.
      
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


//send
export async function maintenanceRequestCreatedSuccessfullyOwner(to: string[]) {
    try {
        const emailInfo = {
            to: to,
            from: "narib09jerry@gmail.com",
            subject: "New Request Logged",
            text: `You have successfully logged a new request
      
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

//notices
//send
export async function mailAnnouncements(to: string[], title: string, message: string) {
    try {
        const emailInfo = {
            to: to,
            from: "narib09jerry@gmail.com",
            subject: `${title}`,
            text: `${message}
      
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

//meetings
//send
export async function mailMeetings(to: string[], title: string, message: string, startDate: string, meeting_location: string, meeting_link: string) {
    try {
        const emailInfo = {
            to: to,
            from: "narib09jerry@gmail.com",
            subject: `${title}`,
            text: `${message}

      The commencement of the meeting was scheduled for ${startDate}.    
      
      ${(meeting_location ? [`Location: ${meeting_location}`] : [])}
      ${(meeting_link ? [`Meeting Link: ${meeting_link}`] : [])}
      
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