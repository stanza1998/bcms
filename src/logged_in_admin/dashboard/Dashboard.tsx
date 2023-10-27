import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";
import { useState } from "react";

const Dashboard = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson?.role;

  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">Dashboard</h4>
          <div className="controls">
            <div className="uk-inline">
              {/* <button className="uk-button primary" type="button">
                Add Supplier
              </button> */}
            </div>
          </div>
        </div>
        {me === "Owner" && <p>Owner</p>}
        {me === "Employee" && <p>Emp</p>}
        {/* {me === "Admin" && <OwnerDashBoard />} */}
      </div>
    </div>
  );
});

export default Dashboard;

const OwnerDashBoard = () => {
  const { api } = useAppContext();
  const fullname = "John Doe";
  const email = "engdesign@lotsinsights.com";
  const subject = "Subject of the email";
  const message = "Body of the email";
  const link = "http://example.com";
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setAttachment(file || null);
  };

  const sendMail = async (e: any) => {
    e.preventDefault();
    if (!attachment) return;

    try {
      await api.mail.sendMail(
        fullname,
        email,
        subject,
        message,
        link,
        attachment
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        // action="https://www.koshaservices.com/php/bcms.php?"
        // method="post"
        encType="multipart/form-data"
        onSubmit={sendMail}
      >
        <input
          className="uk-input"
          type="file"
          name="attachment"
          onChange={handleFileInputChange}
        />
        <br />
        <button className="uk-input" type="submit">
          Submit
        </button>
      </form>
    </>
  );
};

const ManagerDashBoard = () => {};

// try {
//   await api.mail.sendMail(
//     name, // Assuming 'name' is the full name
//     email,
//     subject,
//     message,
//     link,
//     attachment
//   );
// } catch (error) {
//   console.log(error);
// }
