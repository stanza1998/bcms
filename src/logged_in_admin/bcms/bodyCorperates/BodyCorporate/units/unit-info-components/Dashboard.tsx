export const Dashboard = () => {
  return (
    <div className="sales-order">
      <h3
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "600" }}
      >
        Dashboard
      </h3>

      <h5
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "500" }}
      >
        Financial Records
      </h5>
      <div
        className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
        data-uk-grid
      >
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Invoices
            </p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Expenses
            </p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Outstanding Payments
            </p>
          </div>
        </div>
      </div>
      <h5
        style={{ textTransform: "uppercase", color: "grey", fontWeight: "500" }}
      >
        Maintenance and Records
      </h5>
      <div
        className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
        data-uk-grid
      >
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Scheduled Maintenance
            </p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Repairs
            </p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-primary uk-card-body">
            <h3 className="uk-card-title">0</h3>
            <p
              style={{
                textTransform: "uppercase",
                color: "black",
                fontSize: "14px",
                fontWeight: "400",
              }}
            >
              Ongoing Issues
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
