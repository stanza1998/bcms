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
    name:string,
    email: string,
    subject: string,
    message: string,
    link: string
  ) {
    const body = { email, subject, message, link };
    const uri = `${this.API_URI}${stringify(body)}`;
    axios
      .get(uri)
      .then((response) => {
        console.log(response);
        console.log("url", uri);
        alert("view your email address for email confirmation link");
        // SuccessfulAction(ui);
      })
      .catch((error) => {
        //snackbar
        console.log(error);
        alert(error);
      });
  }
}
