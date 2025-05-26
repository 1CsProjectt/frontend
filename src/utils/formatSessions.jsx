/**
 * Formats sessions by adding sessionTitle and (optionally) targetDate properties.
 * @param {Array} sessions - Array of session objects from backend
 * @returns {Array} Array of formatted session objects
 */
function formatSessions(sessions) {
    if (!Array.isArray(sessions)) return [];
  
    const titleMap = {
      TEAM_CREATION: "Group formation session",
      PFE_ASSIGNMENT: "Select topics session",
      WORK_STARTING: "Project Realization Session",
     NORMAL_SESSION: "Normal session",
    };
  
    return sessions.map((session) => {
      const sessionTitle = titleMap[session.name] || "Normal session";
  
      const formatted = {
        ...session,
        sessionTitle,
      };
  
      // Only add targetDate if it's not a normal session and dates exist
      if (sessionTitle !== "Normal session" && session.startTime && session.endTime) {
        formatted.targetDate = {
          start: new Date(session.startTime),
          end: new Date(session.endTime),
        };
      }
  
      return formatted;
    });
  }
  
  export default formatSessions;
  