import axios from "axios";
import AppStore from "../../stores/AppStore";
import AppApi from "../AppApi";

export default class EmailConfirmationApi {
  API_URI: string;
  constructor(private api: AppApi, private store: AppStore, URI: string) {
    this.API_URI = URI;
  }

  //send

  async sendMail(
    title: string,
    emails: string[],
    subject: string,
    message: string,
    link: string,
    // attachment: File
  ) {
    try {
      const uri = `${this.API_URI}`;

      // Loop through the email addresses and send the email to each recipient
      for (let i = 0; i < emails.length; i++) {
        const formData = new FormData();
        formData.append('fullname', title);
        formData.append('email', emails[i]);
        formData.append('subject', subject);
        formData.append('message', message);
        formData.append('link', link);
        // formData.append('attachment', attachment);

        const response = await axios.post(uri, formData);

        console.log(`Email sent to ${emails[i]}`);
        console.log(response);
      }

      console.log("View your email address for email confirmation link");
    } catch (error) {
      console.error(error);
    }
  }

}
