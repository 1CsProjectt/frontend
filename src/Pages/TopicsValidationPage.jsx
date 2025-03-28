import React from "react";
import Navbar from "../components/NavBar";
import PFECard from "../components/CardComponent"; 
import { useState } from "react";
import classes from "../styles/TopicsValidationPage.module.css";

import { useNavigate } from "react-router-dom";



// Example data to pass to the PFECard
const cardData = [
  { id:1,
    title: "Final year project management system ",
    categories: ["ISI", "SIW"],
    description: "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflowsA smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflowsA smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows",
    author: "Guessoum mohamed nizar",
    image: "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg", 
  },
  { id:2,
    title: "Smart task management system for team collaboration",
    categories: ["ISI", "SIW", "IASD"],
    description: "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    author: "Yettou Abdallah",
    image: "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },
  {id:3,
    title: "Final year project management system",
    categories: ["ISI", "SIW"],
    description: "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
    author: "Guessoum mohamed nizar",
    image: "https://s3-alpha-sig.figma.com/img/3c09/f76d/8de97470c93e1e24bac8b4d8a1f71e7e?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eCmern6iF5nrd--ghVPBQEW3H2oFAu1jmMax3aqNzOo3o6V5ofEMNeU5eA37oiwrTwOyZVxAN1LXIRXw4K2HLHdrHZPNW8h0Ye10igoAk6FzMWroAMEj8G4QloRIuHyEC0p2ovUkeT9n8pydEPCcImkF1zXHURszy~N~qcLs9ON~un7gmejD17ETVS-Z5f0Fo~HYwjDt-gVYPZAOqIOzxH75UghPsfozd69dvtrAln2v2R5cgkzd22zhg4fwJEFFhRH9WAzQcqGknQ1BnyUJDxqhOAp7U2l3nd9rcg8Wfn6hS9q4QoE2C05DNcoz9kQ-Rx-4YHJ1fKBlx3AAEyxm2A__", 
  },
  { id:4,
    title: "Smart task management system for team collaboration",
    categories: ["ISI", "SIW", "IASD"],
    description: "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    author: "Yettou Abdallah",
    image: "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },{id:5,
    title: "Final year project management system",
    categories: ["ISI", "SIW"],
    description: "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
    author: "Guessoum mohamed nizar",
    image: "https://s3-alpha-sig.figma.com/img/3c09/f76d/8de97470c93e1e24bac8b4d8a1f71e7e?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eCmern6iF5nrd--ghVPBQEW3H2oFAu1jmMax3aqNzOo3o6V5ofEMNeU5eA37oiwrTwOyZVxAN1LXIRXw4K2HLHdrHZPNW8h0Ye10igoAk6FzMWroAMEj8G4QloRIuHyEC0p2ovUkeT9n8pydEPCcImkF1zXHURszy~N~qcLs9ON~un7gmejD17ETVS-Z5f0Fo~HYwjDt-gVYPZAOqIOzxH75UghPsfozd69dvtrAln2v2R5cgkzd22zhg4fwJEFFhRH9WAzQcqGknQ1BnyUJDxqhOAp7U2l3nd9rcg8Wfn6hS9q4QoE2C05DNcoz9kQ-Rx-4YHJ1fKBlx3AAEyxm2A__", 
  },
  {id:6,
    title: "Smart task management system for team collaboration",
    categories: ["ISI", "SIW", "IASD"],
    description: "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    author: "Yettou Abdallah",
    image: "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },{id:7,
    title: "Final year project management system",
    categories: ["ISI", "SIW"],
    description: "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
    author: "Guessoum mohamed nizar",
    image: "https://s3-alpha-sig.figma.com/img/3c09/f76d/8de97470c93e1e24bac8b4d8a1f71e7e?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eCmern6iF5nrd--ghVPBQEW3H2oFAu1jmMax3aqNzOo3o6V5ofEMNeU5eA37oiwrTwOyZVxAN1LXIRXw4K2HLHdrHZPNW8h0Ye10igoAk6FzMWroAMEj8G4QloRIuHyEC0p2ovUkeT9n8pydEPCcImkF1zXHURszy~N~qcLs9ON~un7gmejD17ETVS-Z5f0Fo~HYwjDt-gVYPZAOqIOzxH75UghPsfozd69dvtrAln2v2R5cgkzd22zhg4fwJEFFhRH9WAzQcqGknQ1BnyUJDxqhOAp7U2l3nd9rcg8Wfn6hS9q4QoE2C05DNcoz9kQ-Rx-4YHJ1fKBlx3AAEyxm2A__", 
  },
  {id :8,
    title: "Smart task management system for team collaboration",
    categories: ["ISI", "SIW", "IASD"],
    description: "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    author: "Yettou Abdallah",
    image: "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },{id:9,
    title: "Final year project management system",
    categories: ["ISI", "SIW"],
    description: "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
    author: "Guessoum mohamed nizar",
    image: "https://s3-alpha-sig.figma.com/img/3c09/f76d/8de97470c93e1e24bac8b4d8a1f71e7e?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eCmern6iF5nrd--ghVPBQEW3H2oFAu1jmMax3aqNzOo3o6V5ofEMNeU5eA37oiwrTwOyZVxAN1LXIRXw4K2HLHdrHZPNW8h0Ye10igoAk6FzMWroAMEj8G4QloRIuHyEC0p2ovUkeT9n8pydEPCcImkF1zXHURszy~N~qcLs9ON~un7gmejD17ETVS-Z5f0Fo~HYwjDt-gVYPZAOqIOzxH75UghPsfozd69dvtrAln2v2R5cgkzd22zhg4fwJEFFhRH9WAzQcqGknQ1BnyUJDxqhOAp7U2l3nd9rcg8Wfn6hS9q4QoE2C05DNcoz9kQ-Rx-4YHJ1fKBlx3AAEyxm2A__", 
  },
  { id:10,
    title: "Smart task management system for team collaboration",
    categories: ["ISI", "SIW", "IASD"],
    description: "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    author: "Yettou Abdallah",
    image: "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },
];



const TopicsValidationPage = () => {

    const [activeTab, setActiveTab] = useState("tab1");
   
    const navigate = useNavigate();

    const HandleBackButton = () => {
    
      /*  if the user has some cards selected it will undo the selection 
      else if nothing is selected it will go back to the previous page */
      navigate(-1);
    }
    

  return (

    <div >
         <Navbar  /> 
    
        
      {/* Tab Buttons */}
    <div className={classes["header"]}>
      <h1>Validate and Control Topics</h1>
      <div className={classes["buttons-container"]}>
      <button className={classes["back-btn"]} onClick={HandleBackButton}>Back</button>
      <button className={classes["delete-btn"]} >Delete Selected Topics</button>
</div>
      </div>
      <div className={classes["tabs"]}>
        <button
          className={activeTab === "tab1"? classes["tab active"] : classes["tab"]}
          onClick={() => setActiveTab("tab1")}
        >
          Published Topics
        </button>
        <button
          className={activeTab === "tab2" ? classes["tab active"] : classes["tab"]}
          onClick={() => setActiveTab("tab2")}
        >
          Submitted Topics
        </button>
        
      </div>

      {/* Tab Content */}
      <div className={classes["tab-content"]}>
        {activeTab === "tab1" && <div className={classes["cards-container"]} >
          {cardData.map((card, index) => (
            <PFECard
              key={index}
              title={card.title}
              categories={card.categories}
              description={card.description}
              author={card.author}
              image={card.image}
            />
          ))}
        </div>}
        {activeTab === "tab2" && <div>Content for Tab 2</div>}
        
      
    </div>
    
    
  
        
      </div>    
    

  );
};

export default TopicsValidationPage;

