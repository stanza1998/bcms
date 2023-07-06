import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import Loading from "../../shared/components/Loading";
import { useAppContext } from "../../shared/functions/Context";


interface ToolCardProps {
  value: number;
  status: string;
}
const DashboardCard = (props: ToolCardProps) => {
  const { value, status } = props;

  return (
    <div>
      <div className="uk-card">
        <div className="uk-flex uk-flex-between">
          <div>
            <h3 className="uk-margin-remove">
              {value}
            </h3>
          </div>
          <div>
          </div>
        </div>
        <p>{status}</p>
      </div>
    </div>
  );
};

const EmployeeDashboard = observer(() => {
  const { api, store } = useAppContext();
  const me = store.user.meJson
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!me) return;
      setLoading(true);
      await api.auth.loadAll();
      setLoading(false);
    }
    loadData()
  }, [api.auth, me]);

  return (
    <div className="uk-section dashboard">
      <div className="uk-container">
        {loading && <Loading />}
        {!loading && (
          <>
            <p className="title">Payrolls</p>
            <hr className="red-line" />
            
            <p className="title">Leave</p>
            <hr className="red-line" />
            <div
              className="uk-child-width-expand@s uk-grid-small uk-grid-match" data-uk-grid >
        
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default EmployeeDashboard;
