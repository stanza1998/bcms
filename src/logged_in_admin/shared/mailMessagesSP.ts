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
                text: `
                    ${greeting},
                    Description: ${message}
                    Utilize the provided unique code for copying and pasting in the designated field labeled "Paste Shared Code.".
                    Your unique code: ${code}
                    Please click the link below to upload your quotation.
                    ${spLink}
                    Kind regards,
                    ${username}
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
//not send
export async function mailSuccessfulServiceProvider(to: string[], workOrderId: string, description: string, dueDate: string) {
    try {
        const emailInfo = {
            to: to,
            from: "narib09jerry@gmail.com",
            subject: "Work Order Awarded",
            text: ` ${greeting},

    Congratulations! You have been awarded a new work order. Here are the details:

    Work Order ID: ${workOrderId}
    Description: ${description}
    Due Date: ${new Date(dueDate).toDateString()}
      
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
                text: ` ${greeting},

    Congratulations! You have been awarded a new work order. Here are the details:

    Work Order ID: ${workOrderId}
    The Work Order Window Period has been extended. The new deadline is ${new Date(dueDate).toDateString()} at ${new Date(dueDate || "").toTimeString()}. 
    Please ensure timely submission.

    Utilize the provided unique code for copying and pasting in the designated field labeled "Paste Shared Code.".
    Your unique code: ${code}
    
    Please use the following link below to upload your documents
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
    }
};


//not successful service providers
export async function unsuccessfulServiceProviders(to: string[], workOrderId: string) {


    try {
        const emailInfo = {
            to: to,
            from: "narib09jerry@gmail.com",
            subject: ` The work order ${workOrderId} was unsuccessful.`,
            text: ` ${greeting},

        We regret to inform you that work order ${workOrderId} was unsuccessful. 
        Despite our best efforts, unforeseen challenges have impeded its successful completion. 
        We apologize for any inconvenience and are actively working to identify the issues and find alternative solutions. 
        Your understanding is greatly appreciated, and we assure you that we are committed to resolving this matter promptly.
        If you have any concerns, feel free to reach out to our customer support team. 
        Thank you for your patience.
   
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

