import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Style from "../styles/CardComponent.module.css";

const PFECard = ({ card, isSelected, toggleSelect, onExplore, buttonText }) => {
  //the buttonText is an optional prop when wanting to override the default buttonText (Explore)
  const navigate = useNavigate();
  const location = useLocation();
  const username =
    card.creator?.username ||
    [card.creator?.lastname, card.creator?.firstname]
      .filter(Boolean) // Remove any undefined/null values
      .join(" ") // Join with space
      .trim() || // Remove any extra whitespace
    "Unknown";
  console.log(username);
  // Default function to handle "Explore" action
  const defaultHandleExplore = (e, card) => {
    e.stopPropagation(); // Prevent select toggle when clicking "Explore"
    navigate("/pfe-student/explore", { state: { card } });
  };

  // If onExplore prop is not passed, fallback to defaultHandleExplore
  const handleExplore = onExplore || defaultHandleExplore;

  return (
    <div
      className={`${Style.card} ${isSelected ? Style.selected : ""}`}
      onClick={() => toggleSelect(card.id)}
    >
      <img src={card.photo} alt={card.title} className={Style["card-image"]} />
      <div className={Style["card-content"]}>
        <h3 className={Style["card-title"]}>{card.title}</h3>
        <div className={Style["card-categories"]}>
          {Array.isArray(card.specialization) ? (
            card.specialization.map((spec, i) => (
              <span key={i} className={Style.category}>
                {spec}
              </span>
            ))
          ) : (
            <span className={Style.category}>{card.specialization}</span>
          )}
        </div>
        <p className={Style["card-description"]}>{card.description}</p>
        <p className={Style["card-author"]}>By {username}</p>
        <button
          className={Style["card-button"]}
          onClick={(e) => handleExplore(e, card)} // Use handleExplore here
        >
          {buttonText || "Explore"}
        </button>
      </div>
    </div>
  );
};

export default PFECard;
