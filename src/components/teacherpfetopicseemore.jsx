import Uploadfile from "./modals/uploadbox";
import React, { useState } from "react";
import ExplorePage from "../Pages/ExplorePage";

const Teacherpfetopicseemore = ({ reason, reasonFile, topic, ondeclined }) => {
  const THE_TOPIC = "The topic";
  const DECLINE_REASON = "Decline reason Logs";
  console.log("the reason is ", reason);
  const [activeTab, setActiveTab] = useState(THE_TOPIC); // ← initialize with THE_TOPIC

  return !ondeclined ? (
    <ExplorePage topic={topic} />
  ) : (
    <div>
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab-item ${activeTab === THE_TOPIC ? "active" : ""}`}
            onClick={() => setActiveTab(THE_TOPIC)}
          >
            The topic
          </button>
          <button
            className={`tab-item ${
              activeTab === DECLINE_REASON ? "active" : ""
            }`}
            onClick={() => setActiveTab(DECLINE_REASON)}
          >
            Decline reason Logs
          </button>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {activeTab === THE_TOPIC && (
          <ExplorePage topic={topic} ondeclined={true} />
        )}
        {activeTab === DECLINE_REASON && (
          <div style={{ padding: "10rem" }}>
            <p
              style={{
                fontSize: "17px",
                fontWeight: 500,
                lineHeight: "1.8", // increase line spacing
                color: "#313638", // set text color
              }}
            >
              {reason}
            </p>
            <Uploadfile type="pdf" pdfFil={reasonFile} status={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Teacherpfetopicseemore;
