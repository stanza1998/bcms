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

const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/vanwylbcms.appspot.com/o/Screenshot%202024-02-08%20124524.png?alt=media&token=147a2420-6535-4fad-bb21-8dfbb4a42894';
//maintenance
//send
export async function OwnerAnnounceLogged(to: string[], firstName: string, lastName: String, description: string) {
    try {
        const emailInfo = {
            to: to,
            from: "narib09jerry@gmail.com",
            subject: "Your Maintenance Request Logged Successfully",
            html: `
            <body
            style="
              font-family: Arial, sans-serif;
              background-color: #ffffff;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            "
          >
            <div
              style="
                max-width: 700px;
                padding: 40px;
                background-color: #ffffff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
              "
            >
              <div style="margin: 20px">
                <h4 style="color: #333333">${greeting},</h4>
                <p style="color: #666666; font-size: 12px">${description}</p>
        
                <p style="color: #666666; font-size: 11px">
                  Your Maintenance Request was Logged Successfully by ${firstName} ${lastName}
                </p>
              </div>
              <div style="margin-top: 20px; font-style: italic; color: #999999">
                <p style="font-size: 9px">
                  Kind regards,<br />Body Corporate Management System
                </p>
              </div>
              <div style="margin-top: 20px">
                <a
                  href="https://vanwylbcms.web.app/"
                  target="blank"
                  style="color: #007bff; text-decoration: none; font-size: 11px"
                  >Access the system</a
                >
              </div>
              <div style="margin-top:20px">
              <img src="${imageUrl}" alt="Image Alt Text" style="max-width: 100%;">
              </div>
            </div>
          </body>
            `,
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
            html: `
            <body
            style="
              font-family: Arial, sans-serif;
              background-color: #ffffff;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            "
          >
            <div
              style="
                max-width: 700px;
                padding: 40px;
                background-color: #ffffff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
              "
            >
              <div style="margin: 20px">
                <h4 style="color: #333333">${greeting},</h4>
              
                <p style="color: #666666; font-size: 12px">You have successfully logged a new request.</p>
                
              </div>
              <div style="margin-top: 20px; font-style: italic; color: #999999">
                <p style="font-size: 9px">
                  Kind regards,<br />Body Corporate Management System
                </p>
              </div>
              <div style="margin-top: 20px">
                <a
                  href="https://vanwylbcms.web.app/"
                  target="blank"
                  style="color: #007bff; text-decoration: none; font-size: 11px"
                  >Access the system</a
                >
              </div>
              <div style="margin-top:20px">
              <img src="${imageUrl}" alt="Image Alt Text" style="max-width: 100%;">
              </div>
            </div>
          </body>
            `,
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
            subject: `New Notice`,
            html: `
            <body
            style="
              font-family: Arial, sans-serif;
              background-color: #ffffff;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            "
          >
            <div
              style="
                max-width: 700px;
                padding: 40px;
                background-color: #ffffff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
              "
            >
              <div style="margin: 20px">
                <h4 style="color: #333333">${greeting},</h4>
                <h3 style="color: #333333">${title}</h3>
                <p style="color: #666666">${message}</p>
              </div>
              <div style="margin-top: 20px; font-style: italic; color: #999999">
                <p style="font-size: 9px">Kind regards,<br />Body Corporate Management System</p>
              </div>
              <div style="margin-top: 20px">
                <a
                  href="vanwylbcms.web.app"
                  target="blank"
                  style="color: #007bff; text-decoration: none; font-size: 11px"
                  >Access the system</a
                >
              </div>
              <div style="margin-top:20px">
              <img src="${imageUrl}" alt="Image Alt Text" style="max-width: 100%;">
              </div>
            </div>
          </body>
        `,

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
            subject: `New Meeting`,
            html: `
            
            <body
            style="
              font-family: Arial, sans-serif;
              background-color: #fff;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            "
          >
            <div
              style="
                max-width: 700px;
                padding: 40px;
                background-color: #ffffff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
              "
            >
              <div style="margin: 20px">
                <h4 style="color: #333333">${greeting},</h4>
                <h3 style="color: #333333">${title}</h3>
                <p style="color: #666666; font-size: 12px">${message}</p>
                <p style="color: #666666; font-size: 10px; margin-top: 4px">
                  The commencement of the meeting was scheduled for ${startDate}
                </p>
                <p style="color: #666666; font-size: 10px; margin-top: 4px">
                  ${(meeting_location ? [`Location: ${meeting_location}`] : [])}
                  <br />
                    ${(meeting_link ? [`Meeting Link: ${meeting_link}`] : [])}
                </p>
              </div>
              <div style="margin-top: 20px; font-style: italic; color: #999999">
                <p style="font-size: 9px">Kind regards,<br />Body Corporate Management System</p>
              </div>
              <div style="margin-top: 20px">
                <a
                  href="https://vanwylbcms.web.app/"
                  target="blank"
                  style="color: #007bff; text-decoration: none; font-size: 11px"
                  >Access the system</a
                >
              </div>
              <div style="margin-top:20px">
              <img src="${imageUrl}" alt="Image Alt Text" style="max-width: 100%;">
              </div>
            </div>
          </body>
            `

            //         `${message}

            // The commencement of the meeting was scheduled for ${startDate}.    

            // ${(meeting_location ? [`Location: ${meeting_location}`] : [])}
            // ${(meeting_link ? [`Meeting Link: ${meeting_link}`] : [])}

            // Kind regards,
            // Body Corporate Management System`,
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