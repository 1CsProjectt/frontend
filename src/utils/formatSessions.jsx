/**
 * Formats sessions by adding sessionTitle and targetDate properties.
 * @param {Array} sessions - Array of session objects from backend
 * @returns {Array} Array of formatted session objects
 */
function formatSessions(sessions) {
    if (!Array.isArray(sessions)) return [];

    return sessions.map((session) => {
        let sessionTitle;
        if (session.name === "TEAM_CREATION") {
            sessionTitle = "Group formation session";
        } else if (session.name === "PFE_ASSIGNMENT") {
            sessionTitle = "Select topics session";
        } else if (session.name === "WORK_STARTING") {
            sessionTitle = "Project Realization Session";
        }else { 
            sessionTitle =  "Normal session";}
           
        

        return {
            ...session,
            sessionTitle,
            targetDate: {
                start: new Date(session.startTime),
                end: new Date(session.endTime),
            },
        };
    });
}

export default formatSessions;
