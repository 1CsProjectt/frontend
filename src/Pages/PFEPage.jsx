import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import PFECard from "../components/CardComponent";
import Style from "../styles/PFEPage.module.css";

// Example data to pass to the PFECard
const cardData = [
  {
    title: "Final year project management system ",
    categories: ["ISI", "SIW"],
    description:
      "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflowsA smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflowsA smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows",
    author: "Guessoum mohamed nizar",
    image:
      "https://cdn.pixabay.com/photo/2016/11/19/22/52/coding-1841550_960_720.jpg",
  },
  {
    title: "Smart task management system for team collaboration",
    categories: ["ISI", "SIW", "IASD"],
    description:
      "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    author: "Yettou Abdallah",
    image:
      "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },
  {
    title: "Final year project management system",
    categories: ["SIW"],
    description:
      "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
    author: "Guessoum mohamed nizar",
    image:
      "https://s3-alpha-sig.figma.com/img/3c09/f76d/8de97470c93e1e24bac8b4d8a1f71e7e?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eCmern6iF5nrd--ghVPBQEW3H2oFAu1jmMax3aqNzOo3o6V5ofEMNeU5eA37oiwrTwOyZVxAN1LXIRXw4K2HLHdrHZPNW8h0Ye10igoAk6FzMWroAMEj8G4QloRIuHyEC0p2ovUkeT9n8pydEPCcImkF1zXHURszy~N~qcLs9ON~un7gmejD17ETVS-Z5f0Fo~HYwjDt-gVYPZAOqIOzxH75UghPsfozd69dvtrAln2v2R5cgkzd22zhg4fwJEFFhRH9WAzQcqGknQ1BnyUJDxqhOAp7U2l3nd9rcg8Wfn6hS9q4QoE2C05DNcoz9kQ-Rx-4YHJ1fKBlx3AAEyxm2A__",
  },
  {
    title: "Smart task management system for team collaboration",
    categories: ["SIW", "IASD"],
    description:
      "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    author: "Yettou Abdallah",
    image:
      "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },
  {
    title: "Final year project management system",
    categories: ["ISI"],
    description:
      "A smart and efficient platform for seamless final year project management, enhancing collaboration, tracking progress, and simplifying workflows ....",
    author: "Guessoum mohamed nizar",
    image:
      "https://s3-alpha-sig.figma.com/img/3c09/f76d/8de97470c93e1e24bac8b4d8a1f71e7e?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eCmern6iF5nrd--ghVPBQEW3H2oFAu1jmMax3aqNzOo3o6V5ofEMNeU5eA37oiwrTwOyZVxAN1LXIRXw4K2HLHdrHZPNW8h0Ye10igoAk6FzMWroAMEj8G4QloRIuHyEC0p2ovUkeT9n8pydEPCcImkF1zXHURszy~N~qcLs9ON~un7gmejD17ETVS-Z5f0Fo~HYwjDt-gVYPZAOqIOzxH75UghPsfozd69dvtrAln2v2R5cgkzd22zhg4fwJEFFhRH9WAzQcqGknQ1BnyUJDxqhOAp7U2l3nd9rcg8Wfn6hS9q4QoE2C05DNcoz9kQ-Rx-4YHJ1fKBlx3AAEyxm2A__",
  },
  {
    title: "Smart task management system for team collaboration",
    categories: ["IASD"],
    description:
      "IA smart task management system designed to enhance team collaboration, streamline workflow, and improve productivity through efficient task tracking......",
    author: "Yettou Abdallah",
    image:
      "https://s3-alpha-sig.figma.com/img/601f/4cd0/b7c927eafaa2a13576589cde4c54bb25?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=trIcs11Y75HyiQyk6KW8IFKqkQaYROMNoshuGSpG9k08VLHNH~mHYQOITv26wwlEeP~qXseSsuKaxNgng9ayQaXNtWRSBMvqD638etfr2jyp~Spz7RJTauILrofk68r11F-5RjVbtdOFIuBHr-h9dM7EN-xLo4L6on1tC~-xG-h9U4F7TIJ7CYKi571IFrvP-eCqNnFWVdIgPA255BZN4V6xmQ048gZ5ocNT-lW2-APe9~qT1X51GOi7BsaVTnoTE4LHA0gN5sAPsddE4dn9Ln1HsYwmUhpxRgvR2eLOBvwSd2tb21UKXRsymdoxX8AFWMjh8Q3pRjcP8cQMhpoHTw__",
  },
];

// Compute suggestion list from card titles, authors, and categories (unique)
const suggestionList = Array.from(
  new Set(
    cardData.flatMap((card) => [
      card.title,
      card.author,
      ...card.categories
    ])
  )
);

const PFEPage = () => {
  /* 
    // State to store card data fetched from the backend 
    const [cards, setCards] = useState([]);
  
    useEffect(() => {
      // Fetch data from your backend API
      axios
        .get("http://your-backend-api-url/api/cards") // Replace with your actual API endpoint 
        .then((response) => {
          setCards(response.data);
        })
        .catch((error) => {
          console.error("Error fetching card data", error);
        });
    }, []); // Run only once when the component mounts
  */
  /* for the Filter  */
  // State for multiple selected filters.
  const [selectedFilters, setSelectedFilters] = useState([]);
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Callback to apply filters from the FilterMenu
  const handleFilterApply = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  // Callback to update the search query from Navbar/Searchbar
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Filter cards: display a card if it matches selected filters and search query.
  const filteredCards = cardData.filter((card) => {
    // Check filters: if any filters are selected, the card must have at least one matching category.
    const filterMatch =
      selectedFilters.length > 0
        ? card.categories.some((cat) => selectedFilters.includes(cat))
        : true;
    // Check search query (case-insensitive) across title, author, and categories.
    const lowerQuery = searchQuery.toLowerCase();
    const titleMatch = card.title.toLowerCase().includes(lowerQuery);
    const authorMatch = card.author.toLowerCase().includes(lowerQuery);
    const categoriesMatch = card.categories.some((cat) =>
      cat.toLowerCase().includes(lowerQuery)
    );
    const searchMatch = titleMatch || authorMatch || categoriesMatch;
    return filterMatch && searchMatch;
  });

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: "16vw" }}>
        <Navbar
          title={"Normal session"}
          selectedFilters={selectedFilters}
          onFilterApply={handleFilterApply}
          onSearchChange={handleSearchChange} // Passing search callback
          suggestions={suggestionList}         // Passing suggestion list
        />
        <div className={Style["cards-container"]}>
          {filteredCards.map((card, index) => (
            <PFECard
              key={index}
              title={card.title}
              categories={card.categories}
              description={card.description}
              author={card.author}
              image={card.image}
            />
          ))}
          {/* for Dynamic */}
          {/* {cards.map((card, index) => (
            <PFECard
              key={card.id || index}
              title={card.title}
              categories={card.categories}
              description={card.description}
              author={card.author}
              image={card.image}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default PFEPage;
