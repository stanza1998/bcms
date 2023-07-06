import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";

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
        {me === "Admin" && <p>Admin</p>}
      </div>
    </div>
  );
});

export default Dashboard;

const OwnerDashBoard = () => {};

const ManagerDashBoard = () => {};
