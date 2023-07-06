import React from "react";

const ToolBar = (props: { title: string }) => {
  return (
    <div className="section-toolbar uk-margin">
      <h4 className="section-heading uk-heading">{props.title}</h4>
      <div className="controls">
        <button className="uk-button primary uk-margin-small-right">
          Download User Manual
        </button>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <>
      <div className="uk-section">
        <div className="uk-container uk-container-large admin">
          <div className="uk-card uk-card-small uk-card-default banner uk-margin">
            <img
              style={{ height: "50vh", width: "100%", objectFit: "cover" }}
              src="https://blog.pixentia.com/hubfs/How%20Governance%20Can%20Align%20L%26D%20with%20Business%20Strategy.png"
              alt=""
            />
          </div>
          <ToolBar title="FAQ" />
          {/* <div>
            <strong>Admin Questions</strong>
          </div>
          <div>
            <ul data-uk-accordion>
              <li className="uk-card uk-card-small uk-card-default uk-card-body">
                <a className="uk-accordion-title" href="#">
                  How can I add a new user to the system?
                </a>
                <div className="uk-accordion-content">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/User_manual/adding_user.png"
                    }
                    alt=""
                  />
                </div>
              </li>
              <li className="uk-card uk-card-small uk-card-default uk-card-body">
                <a className="uk-accordion-title" href="#">
                  How can I add a new scorecard to the system?
                </a>
                <div className="uk-accordion-content">
                  <img
                    src={process.env.PUBLIC_URL + "/User_manual/scorecards.png"}
                    alt=""
                  />
                </div>
              </li>
              <li className="uk-card uk-card-small uk-card-default uk-card-body">
                <a className="uk-accordion-title" href="#">
                  How can I add a new batch to the system?
                </a>
                <div className="uk-accordion-content">
                  <img
                    src={process.env.PUBLIC_URL + "/User_manual/batches.png"}
                    alt=""
                  />
                </div>
              </li>
            </ul>
          </div>
         */}
        </div>
      </div>
    </>
  );
};

export default FAQ;
