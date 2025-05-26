import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Style from "../styles/CardComponent.module.css";

const PFECard = ({
  card,
  isSelected,
  toggleSelect,
  onExplore,
  buttonText,
  sessionTitle,
  targetDate,
  year,
}) => {
  //the buttonText is an optional prop when wanting to override the default buttonText (Explore)
  const navigate = useNavigate();
  const location = useLocation();
  const username = card.creator?.extern
  //added a fallback value for the username by khedim youcef 
  ? card.creator.extern.name
  : (
      (card.creator?.lastname || card.creator?.firstname)
        ? [card.creator.lastname, card.creator.firstname]
        : (card.createdBy?.lastname || card.createdBy?.firstname)
          ? [card.createdBy.lastname, card.createdBy.firstname]
          : [card.creator?.username]
    )
      .filter(Boolean)
      .join(" ")
      .trim() 
  || "Unknown";

  // Default function to handle "Explore" action
  const defaultHandleExplore = (e, card) => {
    e.stopPropagation(); // Prevent select toggle when clicking "Explore"

    navigate("/pfe-student/explore", {
      state: { card, sessionTitle, targetDate },
    });
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
          {/*           added by khedim youcef for the display of the year in the card}
           */}{" "}
          {[
            ...(Array.isArray(card.specialization)
              ? card.specialization
              : card.specialization
              ? [card.specialization]
              : []),
            ...(year &&
            !(
              Array.isArray(card.specialization)
                ? card.specialization
                : [card.specialization]
            ).includes(year)
              ? [year]
              : []),
          ].map((spec, i) => (
            <span key={i} className={Style.category}>
              {spec}
            </span>
          ))}
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
