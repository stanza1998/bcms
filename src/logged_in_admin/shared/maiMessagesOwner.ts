

export async function OwnerAnnounceLogged(to: string[], firstName: string, lastName: String, description: string) {
    try {
        const emailInfo = {
            to: to,
            from: "narib09jerry@gmail.com",
            subject: "Your Maintenance Request Logged Successfully",
            text: `Description: ${description},
      
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