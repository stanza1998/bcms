import { IServiceProvider } from "../../shared/models/maintenance/service-provider/ServiceProviderModel";
import { getCodeUsingEmail } from "./common";

var today: Date = new Date();
var currentHour: number = today.getHours();
var greeting: string = "";
const username: string = "Van Wyk Realtor Property Management System";

if (currentHour < 12) {
    greeting = "Good Morning";
} else if (currentHour < 18) {
    greeting = "Good Afternoon";
} else {
    greeting = "Good Evening";
}

const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/vanwylbcms.appspot.com/o/Screenshot%202024-02-08%20124524.png?alt=media&token=147a2420-6535-4fad-bb21-8dfbb4a42894';

//link
//send
export async function mailServiceProvider(to: string[], workOrder: string, message: string, spLink: string, SP: IServiceProvider[]) {
    try {
        for (const email of to) {
            const code = getCodeUsingEmail(email, SP); // Assuming SP is available in the scope

            const emailInfo = {
                to: [email], // Send email to the current recipient
                from: "narib09jerry@gmail.com",
                subject: workOrder,
                html: `
               ${greeting},
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
                   <p style="color: #666666; font-size: 12px">${message}</p>
           
                   <p style="color: #666666; font-size: 11px">
                     Utilize the provided unique code for copying and pasting in the
                     designated field labeled "Paste Shared Code.".
                   </p>
                   <div style="font-style: italic; color: #999999">
                     <p style="font-size: 9px">Your unique code: ${code}</p>
                   </div>
                   <p style="color: #666666; font-size: 11px">
                     Please click the link below to upload your quotation.
                   </p>
                   <div style="font-style: italic; color: #999999">
                     <p style="font-size: 9px">
                       Work Order Window Period link:
                       <a
                         href=${spLink}
                         target="blank"
                         style="color: #007bff; text-decoration: none; font-size: 8px"
                         >Click Here</a
                       >
                     </p>
                   </div>
                 </div>
                 <div style="margin-top: 20px; font-style: italic; color: #999999">
                   <p style="font-size: 9px">
                     Kind regards,<br />Body Corporate Management System
                   </p>
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
            } else {
            }
        }
    } catch (error) {
        console.error('Error sending emails:', error);
    }
};




//successful service provider
//send
export async function mailSuccessfulServiceProvider(to: string[], workOrderId: string, description: string, dueDate: string) {
    try {
        const emailInfo = {
            to: to,
            from: "narib09jerry@gmail.com",
            subject: "Work Order Awarded",
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
        <p style="color: #666666; font-size: 11px">
          Congratulations! You have been awarded a new work order. Here are the
          details
        </p>
        <div style="font-style: italic; color: #999999">
          <p style="font-size: 9px">Work Order ID: ${workOrderId}</p>
          <p style="font-size: 9px">Description: ${description}</p>
          <p style="font-size: 9px">Due Date: ${new Date(dueDate).toDateString()}</p>
        </div>
        
      </div>
      <div style="margin-top: 20px; font-style: italic; color: #999999">
        <p style="font-size: 9px">
          Kind regards,<br />Body Corporate Management System
        </p>
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



//work order extended 
//send
export async function mailWorkOrderWindowPeriodExtended(to: string[], workOrderId: string, spLink: string, dueDate: string, SP: IServiceProvider[]) {
    for (const emails of to) {
        const code = getCodeUsingEmail(emails, SP)


        try {
            const emailInfo = {
                to: [emails],
                from: "narib09jerry@gmail.com",
                subject: "Work Order Window Period Extended",
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
        <h4 style="color: #333333">Good afternoon,</h4>
        <p style="color: #666666; font-size: 12px">Work Order ID: ${workOrderId}</p>

        <p style="color: #666666; font-size: 11px">
          The Work Order Window Period has been extended. The new deadline is
          ${new Date(dueDate).toDateString()} at ${new Date(dueDate || "").toTimeString()}.
        </p>
        <div style="font-style: italic; color: #999999">
          <p style="font-size: 9px">
            Utilize the provided unique code for copying and pasting in the
            designated field labeled "Paste Shared Code.". Your unique code:
            ${code}
          </p>
          <p style="font-size: 9px">
            Please use the following link below to upload your documents
            ${spLink}
          </p>
        </div>
      </div>
      <div style="margin-top: 20px; font-style: italic; color: #999999">
        <p style="font-size: 9px">
          Kind regards,<br />Body Corporate Management System
        </p>
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
    }
};


//not successful service providers
//send
export async function unsuccessfulServiceProviders(to: string[], workOrderId: string) {


    try {
        const emailInfo = {
            to: to,
            from: "narib09jerry@gmail.com",
            subject: ` The work order ${workOrderId} was unsuccessful.`,
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
        <h4 style="color: #333333">Good afternoon,</h4>
        <p style="color: #666666; font-size: 12px">
          We regret to inform you that work order ${workOrderId} was
          unsuccessful. Despite our best efforts, unforeseen challenges have
          impeded its successful completion. We apologize for any inconvenience
          and are actively working to identify the issues and find alternative
          solutions. Your understanding is greatly appreciated, and we assure
          you that we are committed to resolving this matter promptly. If you
          have any concerns, feel free to reach out to our customer support
          team. Thank you for your patience.
        </p>
      </div>
      <div style="margin-top: 20px; font-style: italic; color: #999999">
        <p style="font-size: 9px">
          Kind regards,<br />Body Corporate Management System
        </p>
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

