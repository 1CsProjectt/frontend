import React from "react";
import { useNavigate } from "react-router-dom";
import Style from "../styles/CardComponent.module.css";

const PFECard = ({ card, isSelected, toggleSelect }) => {
  const navigate = useNavigate();

  const handleExplore = (e) => {
    e.stopPropagation(); // Prevent select toggle when clicking "Explore"
    navigate("/pfe/explore", { state: { card } });
  };

  return (
    <div
      className={`${Style.card} ${isSelected ? Style.selected : ""}`}
      onClick={() => toggleSelect(card.id)}
    >
      <img
        src={card.photo || "https://via.placeholder.com/300x200"}
        alt={card.title}
        className={Style["card-image"]}
      />
      <div className={Style["card-content"]}>
        <h3 className={Style["card-title"]}>{card.title}</h3>
        <div className={Style["card-categories"]}>
          {card.specialization?.map((spec, i) => (
            <span key={i} className={Style.category}>
              {spec}
            </span>
          ))}
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
