import {
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";
import AppApi from "../AppApi";
import AppStore from "../../stores/AppStore";
import { IInvoice } from "../../models/invoices/Invoices";

export default class InvoiceApi {
  collectionRef: CollectionReference;
  constructor(
    private api: AppApi,
    private store: AppStore,
    collectionRef: CollectionReference
  ) {
    this.collectionRef = collectionRef;
  }

  async getAll() {
    const q = query(this.collectionRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: IInvoice[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ invoiceId: doc.id, ...doc.data() } as IInvoice);
      });

      this.store.bodyCorperate.invoice.load(items);
    });

    return unsubscribe;
  }

  async getInvoice(id: string) {
    const docSnap = await getDoc(doc(this.collectionRef, id));
    if (docSnap.exists()) {
      const body = { ...docSnap.data(), invoiceId: docSnap.id } as IInvoice;
      await this.store.bodyCorperate.invoice.load([body]);
      return body;
    } else return undefined;
  }

  async create(data: IInvoice) {
    const docRef = doc(this.collectionRef);
    data.invoiceId = docRef.id;
    await setDoc(docRef, data, { merge: true });
    return data;
  }

  async update(invoice: IInvoice) {
    await setDoc(doc(this.collectionRef, invoice.invoiceId), invoice, {
      merge: true,
    });
    return invoice;
  }

  async delete(id: string) {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
    this.store.bodyCorperate.invoice.remove(id);
  }

  // async scheduleReminderEmail(invoice: IInvoice) {
  //   const { reminderDate } = invoice;

  //   if (reminderDate) {
  //     // Parse the reminder date into a Date object (assuming 'reminder' is a valid date string in 'YYYY-MM-DD' format)
  //     const reminderDateObj = new Date(reminderDate);

  //     // Schedule the reminder email using node-cron
  //     const reminderTask = cron.schedule(reminderDateObj, async () => {
  //       try {
  //         // Implement the logic to send the reminder email using your email library (e.g., nodemailer)
  //         // Example:
  //         // const mailOptions = {
  //         //   from: "your_email@example.com",
  //         //   to: recipientEmail,
  //         //   subject: "Reminder: Invoice Due Soon",
  //         //   text: `This is a friendly reminder that invoice #${invoice.invoiceId} is due on ${reminder}.`,
  //         // };

  //         // Call the email-sending function (make sure you have set up nodemailer or another email library)
  //         await 

  //         // After sending the email, you can choose to cancel the scheduled task
  //         // (optional if you want to send the reminder only once)
  //         reminderTask.destroy();

  //         console.log("Reminder email sent successfully.");
  //       } catch (error) {
  //         console.error("Error sending the reminder email:", error);
  //       }
  //     });

  //     console.log("Reminder email scheduled successfully.");
  //   }
  // }
}
