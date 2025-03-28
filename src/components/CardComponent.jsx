import React from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/CardComponent.css";

const PFECard = ({ title, categories, description, author, image }) => {
  const navigate = useNavigate();

  
  const handleExplore = () => {
    // If you need to pass data to ExplorePage, you could do:
    // navigate("/explore", { state: { title, categories, description, author, image } });
    // For now, we’ll just navigate to the explore page:
    navigate("/pfe/explore");
  };

  return (
    <div className="card">
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-categories">
          {categories.map((cat, index) => (
            <span key={index} className="category">
              {cat}
            </span>
          ))}
        </div>
        <p className="card-description">{description}</p>
        <p className="card-author">By {author}</p>

        {/* 3) Updated button with onClick */}
        <button className="card-button" onClick={handleExplore}>
          Explore
        </button>
      </div>
    </div>
  );
};

export default PFECard;

