import { useEffect, useState } from "react";
import { Tab } from "../../../../../Tab";
import { NormalLineGraph } from "../../graphs/LineGraph";
import { PieChart } from "../../graphs/PieChart";
import icon1 from "../../assets/undraw_discount_d-4-bd.svg";
import icon2 from "../../assets/undraw_investing_re_bov7.svg";
import icon3 from "../../assets/undraw_segmentation_re_gduq.svg";
import icon4 from "../../assets/undraw_setup_analytics_re_foim.svg";
import icon5 from "../../assets/undraw_charts_re_5qe9.svg";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { nadFormatter } from "../../../../shared/NADFormatter";

export const CustomerInvoicesOverview = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;

  const [activeTab, setActiveTab] = useState("normal");

  const handleTabClick = (tabLabel: string) => {
    setActiveTab(tabLabel);
  };

  const invoice = store.bodyCorperate.copiedInvoices.all;

  const totalPaidAmmount = invoice.reduce(
    (total, inv) => total + inv.asJson.totalPaid,
    0
  );
  const totalOutstandinfAmmount = invoice.reduce(
    (total, inv) => total + inv.asJson.totalDue,
    0
  );

  const totalInvoices = invoice.length;

  const currentDate = new Date();

  const overdueInvoices = invoice.filter((invoice) => {
    const dueDate = new Date(invoice.asJson.dueDate);
    const totalPaid = invoice.asJson.totalPaid;
    const totalDue = invoice.asJson.totalDue;

    return currentDate > dueDate && totalPaid < totalDue;
  });

  const totalOverDueInvoice = overdueInvoices.length;

  useEffect(() => {
    const getData = async () => {
      if (me?.property && me?.year) {
        await api.body.copiedInvoice.getAll(me?.property, me?.year);
      }
    };
    getData();
  }, [api.body.copiedInvoice, me?.property, me?.year]);

  return (
    <div className="accounting">
      <div className="uk-margin">
        <h4
          style={{
            fontWeight: "800",
            color: "lightgrey",
            textTransform: "uppercase",
          }}
        >
          Key Matrics
        </h4>
        <div
          className="uk-child-width-1-4@m uk-grid-small uk-grid-match"
          data-uk-grid
        >
          <div>
            <div
              className="uk-card uk-card-default uk-card-body"
              style={{
                backgroundImage: `url(${icon2})`,
                backgroundPosition: "right",
                backgroundSize: "40%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h3 className="uk-card-title">Total Revenue</h3>
              <p className="uk-value">
                {nadFormatter.format(totalPaidAmmount)}
              </p>
            </div>
          </div>
          <div>
            <div
              className="uk-card uk-card-default uk-card-body"
              style={{
                backgroundImage: `url(${icon5})`,
                backgroundPosition: "right",
                backgroundSize: "40%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h3 className="uk-card-title">Outstanding Amount</h3>
              <p className="uk-value">
                {nadFormatter.format(totalOutstandinfAmmount)}
              </p>
            </div>
          </div>
          <div>
            <div
              className="uk-card uk-card-default uk-card-body"
              style={{
                backgroundImage: `url(${icon3})`,
                backgroundPosition: "right",
                backgroundSize: "40%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h3 className="uk-card-title">Total Invoices</h3>
              <p className="uk-value"># {totalInvoices}</p>
            </div>
          </div>
          <div>
            <div
              className="uk-card uk-card-default uk-card-body"
              style={{
                backgroundImage: `url(${icon4})`,
                backgroundPosition: "right",
                backgroundSize: "40%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h3 className="uk-card-title">Overdue Invoices</h3>
              <p className="uk-value"># {totalOverDueInvoice}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="uk-margin">
        <h4
          style={{
            fontWeight: "800",
            color: "lightgrey",
            textTransform: "uppercase",
          }}
        >
          Graphs & Charts
        </h4>
        <div className="uk-margin">
          <div>
            <div
              style={{ padding: "10px" }}
              className="uk-margin  uk-card-default"
            >
              <Tab
                label="Revenue Trend"
                isActive={activeTab === "normal"}
                onClick={() => handleTabClick("normal")}
              />
              <Tab
                label="Invoice Status Distribution"
                isActive={activeTab === "recuring"}
                onClick={() => handleTabClick("recuring")}
              />
            </div>
            <div className="tab-content">
              {activeTab === "normal" && (
                <div
                  className="uk-card-extra uk-card-default uk-card-body uk-width-1-1@m"
                  style={{ height: "30rem" }}
                >
                  <NormalLineGraph />
                </div>
              )}
              {activeTab === "recuring" && (
                <div className="uk-card-extra uk-card-default uk-card-body uk-width-1-1@m">
                  <PieChart />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
