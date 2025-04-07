import React from "react";
import { useNavigate } from "react-router-dom";
import Style from "../styles/CardComponent.module.css";

const PFECard = ({ card }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    // Navigate to the explore page and pass the card data as state
    navigate("/pfe/explore", { state: { card } });
  };

  return (
    <div className={Style.card}>
      <img
        src={card.photo || "https://via.placeholder.com/300x200"}
        alt={card.title}
        className={Style["card-image"]}
      />
      <div className={Style["card-content"]}>
        <h3 className={Style["card-title"]}>{card.title}</h3>
        <div className={Style["card-categories"]}>
          <span className={Style.category}>
            {card.specialization || "No specialization"}
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
