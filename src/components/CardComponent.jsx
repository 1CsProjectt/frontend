import React from "react";
import { useNavigate } from "react-router-dom"; 
import Style from  "../styles/CardComponent.module.css";

const PFECard = ({ title, categories, description, author, image }) => {
  const navigate = useNavigate();

  
  const handleExplore = () => {
    // Dymanically navigate to the explore page with the card data
   // navigate(`/pfe/explore/${id}`);
    // For now, we’ll just navigate to the explore page:
     navigate("/pfe/explore"); 
  };

  return (
    <div className={Style.card}>
      <img src={image} alt={title} className={Style["card-image"]} />
      <div className={Style["card-content"]}>
        <h3 className={Style["card-title"]}>{title}</h3>
        <div className={Style["card-categories"]}>
          {categories.map((cat, index) => (
            <span key={index} className={Style.category}>
              {cat}
            </span>
          ))}
        </div>
        <p className={Style["card-description"]}>{description}</p>
        <p className={Style["card-author"]}>By {author}</p>
        <button className={Style["card-button"]} onClick={handleExplore}>
          Explore
        </button>
      </div>
    </div>
  );
};

export default PFECard;

