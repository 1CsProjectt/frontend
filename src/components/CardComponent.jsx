import React from "react";
import { useNavigate ,useLocation } from "react-router-dom";
import Style from "../styles/CardComponent.module.css";
/* For testing */
const staticCardData = {
  title: "Example Card",
  photo: "https://example.com/sample.jpg",
  description: "This is a sample description for the card.",
  specialization: "Computer Science",
  creator: {
    username: "JohnDoe"
  }
};


const PFECard = ({ card }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleExplore = () => {
    // Check the current page and navigate accordingly
    if (location.pathname.includes("/pfe")) {
      navigate("/pfe/explore", { state: { card } });
    } else if (location.pathname.includes("/admin/sessions/topic-validation")) {
      navigate("/admin/sessions/topic-validation/explore", { state: { card } });
    } else {
      // Fallback route if needed
      navigate("/default/explore", { state: { card : staticCardData } });
    }
  };;

  return (
    <div className={Style.card}>
      <img
        src={card.photo }
        alt={card.title}
        className={Style["card-image"]}
      />
      <div className={Style["card-content"]}>
        <h3 className={Style["card-title"]}>{card.title}</h3>
        <div className={Style["card-categories"]}>
          <span className={Style.category}>
            {card.specialization || "None"}
          </span>
        </div>
        <p className={Style["card-description"]}>{card.description}</p>
        <p className={Style["card-author"]}>By {card.creator?.username}</p>
        <button className={Style["card-button"]} onClick={handleExplore}>
          Explore
        </button>
      </div>
    </div>
  );
};

export default PFECard;
