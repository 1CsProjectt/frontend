  import React from "react";
  import Navbar from "../components/NavBar";
  import PFECard from "../components/CardComponent";
  import { useState } from "react";
  import classes from "../styles/TopicsValidationPage.module.css";
  import DeleteUserModal from "../components/modals/DeleteUserModal.jsx";

  import { useNavigate } from "react-router-dom";

  // Example data to pass to the PFECard
  const cardsArray = [
    {
      id: 1,
      title: "Final year project management system ",
      category: ["ISI", "SIW"],
      description:
        "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflowsA smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflowsA smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows",
        creator :{
          author: "Guessoum mohamed nizar",
        },
      
      photo:
        "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg",
    },
    {
      id: 2,
      title: "Smart task management system for team collaboration",
      categories: ["ISI", "SIW", "IASD"],
      description:
        "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
      author: "Yettou Abdallah",
      image:
        "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg",
    },
    {
      id: 3,
      title: "Final year project management system",
      categories: ["ISI", "SIW"],
      description:
        "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
      author: "Guessoum mohamed nizar",
      image:
        "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg",
    },
    {
      id: 4,
      title: "Smart task management system for team collaboration",
      categories: ["ISI", "SIW", "IASD"],
      description:
        "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
      author: "Yettou Abdallah",
      image:
        "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg",
    },
    {
      id: 5,
      title: "Final year project management system",
      categories: ["ISI", "SIW"],
      description:
        "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
      author: "Guessoum mohamed nizar",
      image:
        "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg",
    },
    {
      id: 6,
      title: "Smart task management system for team collaboration",
      categories: ["ISI", "SIW", "IASD"],
      description:
        "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
      author: "Yettou Abdallah",
      image:
        "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg",
    },
    {
      id: 7,
      title: "Final year project management system",
      categories: ["ISI", "SIW"],
      description:
        "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
      author: "Guessoum mohamed nizar",
      image:
        "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg",
    },
    {
      id: 8,
      title: "Smart task management system for team collaboration",
      categories: ["ISI", "SIW", "IASD"],
      description:
        "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
      author: "Yettou Abdallah",
      image:
        "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg",
    },
    {
      id: 9,
      title: "Final year project management system",
      categories: ["ISI", "SIW"],
      description:
        "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
      author: "Guessoum mohamed nizar",
      image:
        "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg",
    },
    {
      id: 10,
      title: "Smart task management system for team collaboration",
      categories: ["ISI", "SIW", "IASD"],
      description:
        "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
      author: "Yettou Abdallah",
      image:
        "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg",
    },
  ];

  const TopicsValidationPage = () => {
    const [activeTab, setActiveTab] = useState("tab1"); // Default active tab
    const [isChecked, setIsChecked] = useState(false);// for the select all checkbox
    const [selectedCards, setSelectedCards] = useState([]); // Moved state here
    const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
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
          <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
          All
        </label>
        <p>{selectedCards.length} Selected</p>
        </div>
          <div className={classes["buttons-container"]}>
            <button className={classes["back-btn"]} onClick={HandleBackButton}>
              Back
            </button>
            <button onClick={() => setDeleteUserModalOpen(true)} className={classes["delete-btn"]}>
              Delete Selected Topics
            </button>
         
            <DeleteUserModal isOpen={isDeleteUserModalOpen} onClose={() => setDeleteUserModalOpen(false)} entityType="User" />
            isDeleteUserModalOpen
          </div>
        </div>
        <div className={classes["tabs"]}>
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
        </div>

        {/* Tab Content */}
        <div className={classes["tab-content"]}>
          {activeTab === "tab1" && (
            <div className={classes["cards-container"]}>
              {cardsArray.map((card) => (
             <PFECard key={card.id } card={card} />
          ))}
            </div>
          )}
          {activeTab === "tab2" && <div>Content for Tab 2</div>}
        </div>
      </div>
    );
  };

  export default TopicsValidationPage;
