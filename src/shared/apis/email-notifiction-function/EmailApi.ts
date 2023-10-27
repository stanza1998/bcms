import axios from "axios";
import { stringify } from "querystring";
import AppStore from "../../stores/AppStore";
import AppApi from "../AppApi";
import { SuccessfulAction } from "../../models/Snackbar";

export default class EmailConfirmationApi {
  API_URI: string;
  constructor(private api: AppApi, private store: AppStore, URI: string) {
    this.API_URI = URI;
  }

  //send

  async sendMail(
    fullname: string,
    email: string,
    subject: string,
    message: string,
    link: string,
    attachment: File
  ) {
    const formData = new FormData(); 
    formData.append('fullname', fullname);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('link', link);
    formData.append('attachment', attachment);

    try {
      const uri = `${this.API_URI}`;
      const response = await axios.post(uri, formData);

      console.log(response);
      console.log("View your email address for email confirmation link");
    } catch (error) {
      console.error(error);
    }
  }

  // async sendMail(
  //   fullname: string,
  //   email: string,
  //   subject: string,
  //   message: string,
  //   link: string,
  //   attachment: File
  // ) {
  //   const formData = new FormData();
  //   formData.append('fullname', fullname);
  //   formData.append('email', email);
  //   formData.append('subject', subject);
  //   formData.append('message', message);
  //   formData.append('link', link);
  //   formData.append('attachment', attachment);

  //   try {
  //     const uri = `${this.API_URI}${stringify(formData)}`
  //     const response = await axios.get(uri);
  //     console.log(response);
  //     console.log("View your email address for email confirmation link");

  //     // alert("View your email address for email confirmation link");
  //     // return response;
  //   } catch (error) {
  //     console.error(error);

  //   }
  // }
  // async sendMail(
  //   fullname:string,
  //   email: string,
  //   subject: string,
  //   message: string,
  //   link: string,
  //   attachment:File
  // ) {
  //   const body = { fullname, email, subject, message, link, attachment };
  //   const uri = `${this.API_URI}${stringify(body)}`;
  //   axios
  //     .get(uri)
  //     .then((response) => {
  //       console.log(response);
  //       console.log("url", uri);
  //       alert("view your email address for email confirmation link");
  //       // SuccessfulAction(ui);
  //     })
  //     .catch((error) => {
  //       //snackbar
  //       console.log(error);
  //       alert(error);
  //     });
  // }
}
