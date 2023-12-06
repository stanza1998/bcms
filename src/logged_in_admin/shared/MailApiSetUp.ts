// src/utils/sendEmail.ts

import axios from 'axios';

interface EmailData {
    to: string;
    subject: string;
    body: string;
}

export async function sendEmail(emailData: EmailData): Promise<void> {

    try {
        // Make a request to your proxy server
        await axios.post('http://localhost:3001/send-email', emailData);
        console.log('Email sent successfully');
    } catch (error) {
        // Handle the error, e.g., show an error message to the user
        console.error('Error sending email:', error);
    }
}
