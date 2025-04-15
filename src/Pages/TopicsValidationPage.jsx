import React from "react";
import Navbar from "../components/NavBar";
import PFECard from "../components/CardComponent";
import { useState } from "react";
import classes from "../styles/TopicsValidationPage.module.css";
import PfeTopicModal from "../components/modals/PfeTopicModal.jsx";

import { useNavigate } from "react-router-dom";

// Example data to pass to the PFECard
const cardsArray = [
  {
    id: 1,
    title: "Final year project management system ",
    specialization: ["ISI", "SIW"],
    description:
      "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflowsA smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflowsA smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflowsA smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflowsA smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflowsA smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking...... IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking...... IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking...... IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    creator: { username: "Guessoum mohamed nizar" },

    photo:
      "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg",
  },
  {
    id: 2,
    title: "Smart task management system for team collaboration",
    specialization: ["ISI", "SIW", "IASD"],
    description:
      "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    creator: { username: "Guessoum mohamed nizar" },
    photo:
      "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },
  {
    id: 3,
    title: "Final year project management system",
    specialization: ["ISI", "SIW"],
    description:
      "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
    creator: { username: "Guessoum mohamed nizar" },
    photo:
      "https://s3-alpha-sig.figma.com/img/3c09/f76d/8de97470c93e1e24bac8b4d8a1f71e7e?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eCmern6iF5nrd--ghVPBQEW3H2oFAu1jmMax3aqNzOo3o6V5ofEMNeU5eA37oiwrTwOyZVxAN1LXIRXw4K2HLHdrHZPNW8h0Ye10igoAk6FzMWroAMEj8G4QloRIuHyEC0p2ovUkeT9n8pydEPCcImkF1zXHURszy~N~qcLs9ON~un7gmejD17ETVS-Z5f0Fo~HYwjDt-gVYPZAOqIOzxH75UghPsfozd69dvtrAln2v2R5cgkzd22zhg4fwJEFFhRH9WAzQcqGknQ1BnyUJDxqhOAp7U2l3nd9rcg8Wfn6hS9q4QoE2C05DNcoz9kQ-Rx-4YHJ1fKBlx3AAEyxm2A__",
  },
  {
    id: 4,
    title: "Smart task management system for team collaboration",
    specialization: ["ISI", "SIW", "IASD"],
    description:
      "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    creator: { username: "Guessoum mohamed nizar" },
    photo:
      "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },
  {
    id: 5,
    title: "Final year project management system",
    specialization: ["ISI", "SIW"],
    description:
      "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
    creator: { username: "Guessoum mohamed nizar" },
    photo:
      "https://s3-alpha-sig.figma.com/img/3c09/f76d/8de97470c93e1e24bac8b4d8a1f71e7e?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eCmern6iF5nrd--ghVPBQEW3H2oFAu1jmMax3aqNzOo3o6V5ofEMNeU5eA37oiwrTwOyZVxAN1LXIRXw4K2HLHdrHZPNW8h0Ye10igoAk6FzMWroAMEj8G4QloRIuHyEC0p2ovUkeT9n8pydEPCcImkF1zXHURszy~N~qcLs9ON~un7gmejD17ETVS-Z5f0Fo~HYwjDt-gVYPZAOqIOzxH75UghPsfozd69dvtrAln2v2R5cgkzd22zhg4fwJEFFhRH9WAzQcqGknQ1BnyUJDxqhOAp7U2l3nd9rcg8Wfn6hS9q4QoE2C05DNcoz9kQ-Rx-4YHJ1fKBlx3AAEyxm2A__",
  },
  {
    id: 6,
    title: "Smart task management system for team collaboration",
    specialization: ["ISI", "SIW", "IASD"],
    description:
      "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    creator: { username: "Guessoum mohamed nizar" },
    photo:
      "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },
  {
    id: 7,
    title: "Final year project management system",
    specialization: ["ISI", "SIW"],
    description:
      "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
    creator: { username: "Guessoum mohamed nizar" },
    photo:
      "https://s3-alpha-sig.figma.com/img/3c09/f76d/8de97470c93e1e24bac8b4d8a1f71e7e?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eCmern6iF5nrd--ghVPBQEW3H2oFAu1jmMax3aqNzOo3o6V5ofEMNeU5eA37oiwrTwOyZVxAN1LXIRXw4K2HLHdrHZPNW8h0Ye10igoAk6FzMWroAMEj8G4QloRIuHyEC0p2ovUkeT9n8pydEPCcImkF1zXHURszy~N~qcLs9ON~un7gmejD17ETVS-Z5f0Fo~HYwjDt-gVYPZAOqIOzxH75UghPsfozd69dvtrAln2v2R5cgkzd22zhg4fwJEFFhRH9WAzQcqGknQ1BnyUJDxqhOAp7U2l3nd9rcg8Wfn6hS9q4QoE2C05DNcoz9kQ-Rx-4YHJ1fKBlx3AAEyxm2A__",
  },
  {
    id: 8,
    title: "Smart task management system for team collaboration",
    specialization: ["ISI", "SIW", "IASD"],
    description:
      "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    creator: { username: "Guessoum mohamed nizar" },
    photo:
      "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },
  {
    id: 9,
    title: "Final year project management system",
    specialization: ["ISI", "SIW"],
    description:
      "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
    creator: { username: "Guessoum mohamed nizar" },
    photo:
      "https://s3-alpha-sig.figma.com/img/3c09/f76d/8de97470c93e1e24bac8b4d8a1f71e7e?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eCmern6iF5nrd--ghVPBQEW3H2oFAu1jmMax3aqNzOo3o6V5ofEMNeU5eA37oiwrTwOyZVxAN1LXIRXw4K2HLHdrHZPNW8h0Ye10igoAk6FzMWroAMEj8G4QloRIuHyEC0p2ovUkeT9n8pydEPCcImkF1zXHURszy~N~qcLs9ON~un7gmejD17ETVS-Z5f0Fo~HYwjDt-gVYPZAOqIOzxH75UghPsfozd69dvtrAln2v2R5cgkzd22zhg4fwJEFFhRH9WAzQcqGknQ1BnyUJDxqhOAp7U2l3nd9rcg8Wfn6hS9q4QoE2C05DNcoz9kQ-Rx-4YHJ1fKBlx3AAEyxm2A__",
  },
  {
    id: 10,
    title: "Smart task management system for team collaboration",
    specialization: ["ISI", "SIW", "IASD"],
    description:
      "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    creator: { username: "Guessoum mohamed nizar" },
    photo:
      "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },
];

const TopicsValidationPage = () => {
  const [activeTab, setActiveTab] = useState("tab1"); // Default active tab
  const [isChecked, setIsChecked] = useState(false); // for the select all checkbox
  const [selectedCards, setSelectedCards] = useState([]); // Moved state here
  const [isPfeTopicModalOpen, setPfeTopicModalOpen] = useState(false);
  //isDeleteUserModalOpen is a state variable that controls the visibility of the delete user modal

  //the selectedCards array holds the ids of the currently selected cards

  const navigate = useNavigate();

  const HandleBackButton = () => {
    /*  if the user has some cards selected it will undo the selection 
        else if nothing is selected it will go back to the previous page */
    navigate(-1);
  };

  const toggleSelect = (id) => {
    setSelectedCards((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((cardId) => cardId !== id)
        : [...prev, id];

      // If all cards are selected, check the "Select All" box; otherwise, uncheck it
      setIsChecked(newSelected.length === cardsArray.length);
      return newSelected;
    });
  };

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    setSelectedCards(checked ? cardsArray.map((card) => card.id) : []);
  };

  return (
    <div>
      <Navbar />

      {/* Tab Buttons */}
      <div className={classes["header"]}>
        <div className={classes["left-side-container"]}>
          <h1>Validate and Control Topics</h1>
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            All
          </label>
          <p>{selectedCards.length} Selected</p>
        </div>
        <div className={classes["buttons-container"]}>
          <button className={classes["back-btn"]} onClick={HandleBackButton}>
            Back
          </button>
          <button
            onClick={() => setPfeTopicModalOpen(true)}
            className={classes["delete-btn"]}
          >
            Delete Selected Topics
          </button>

          <PfeTopicModal
            isOpen={isPfeTopicModalOpen}
            onClose={() => setPfeTopicModalOpen(false)}
            entityType="User"
            operation="delete"
          />
        </div>
      </div>
      {/*   <div className={classes["tabs"]}>
          <button
            className={
              activeTab === "tab1" ? classes["tab active"] : classes["tab"]
            }
            onClick={() => setActiveTab("tab1")}
          >
            Published Topics
          </button>
          <button
            className={
              activeTab === "tab2" ? classes["tab active"] : classes["tab"]
            }
            onClick={() => setActiveTab("tab2")}
          >
            Submitted Topics
          </button>
        </div> */}
      <div className={classes.tabs}>
        <button
          className={activeTab === "tab1" ? classes.active : ""}
          onClick={() => setActiveTab("tab1")}
        >
          Published Topics
        </button>
        <button
          className={activeTab === "tab2" ? classes.active : ""}
          onClick={() => setActiveTab("tab2")}
        >
          Submitted Topics
        </button>
      </div>

      {/* Tab Content */}
      <div className={classes["tab-content"]}>
        {activeTab === "tab1" && (
          <div className={classes["cards-container"]}>
            {cardsArray.map((card) => (
              <PFECard
                key={card.id}
                card={card}
                isSelected={selectedCards.includes(card.id)}
                toggleSelect={toggleSelect}
                const
                onExplore={(e, card) => {
                  e.stopPropagation(); // Prevent select toggle when clicking "Explore"
                  navigate(
                    "/admin/sessions/topic-validation/published-topic-explore",
                    {
                      state: { card },
                    }
                  );
                }}
              />
            ))}
          </div>
        )}
        {activeTab === "tab2" && (
          <div className={classes["cards-container"]}>
            {cardsArray.map((card) => (
              <PFECard
                key={card.id}
                card={card}
                isSelected={selectedCards.includes(card.id)}
                toggleSelect={toggleSelect}
                const
                onExplore={(e, card) => {
                  e.stopPropagation(); // Prevent select toggle when clicking "Explore"
                  navigate(
                    "/admin/sessions/topic-validation/submitted-topic-explore",
                    {
                      state: { card },
                    }
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsValidationPage;
