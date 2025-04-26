import React, { createContext, useState, useContext } from 'react';

// Create a context for shared state
const SharedStateContext = createContext();

// Custom hook to access shared state
export const useSharedState = () => {
  return useContext(SharedStateContext);
};

// Provider component to wrap around your app
export const SharedStateProvider = ({ children }) => {
  // Define your global states here
  const [sharedState, setSharedState] = useState(null);
  const [sessionsPageActiveTab, setSessionsPageActiveTab] = useState("Topic Submission Session");
  const [isAdminSeeMoreActive,setAdminSeemMoreActive] =useState(true);

  return (
    <SharedStateContext.Provider 
      value={{ 
        sharedState, 
        setSharedState,
        sessionsPageActiveTab, 
        setSessionsPageActiveTab,
        isAdminSeeMoreActive,
        setAdminSeemMoreActive
      }}>
      {children}
    </SharedStateContext.Provider>
  );
};
