import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import Style from '../../styles/AdminManagePreferencesPage.module.css';


axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const AdminCreateTeamModal = ({ show, onClose,students},setShowToast,setToastMessage) => {

  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [supervisorId, setSupervisorId] = useState(null);
  const [maxNumber, setMaxNumber] = useState("5"); 
  const [selectedTeam, setSelectedTeam] = useState(null); 
  useEffect(() => {
    if (show) {
      // Clear all input fields and state when modal opens
      setMemberInput('');
      setMembers([]);
      setGroupName('');
      setSupervisorId(null);
      setMaxNumber('5');
      setSelectedTeam(null);
      setShowAlert(false);
      
     
    }
  }, [show]);



  const addMember = () => {
    if (memberInput.trim() !== '') {
      const matchedStudent = students.find(
        (student) =>
          student.email.toLowerCase() === memberInput.toLowerCase() ||
          student.fullName.toLowerCase() === memberInput.toLowerCase()
      );


  
      const newMember = matchedStudent
      ? {
          id: matchedStudent.id,
          email: matchedStudent.email,
          fullName: matchedStudent.fullName,
          year: matchedStudent.year,
          specialite: matchedStudent.specialite,
        }
      : {
          id: null,
          email: memberInput,
          fullName: memberInput,
          year: "",
          specialite: "",
        };

        // Check if the member already exists to prevent duplicates
        if (members.some((m) => m.email === newMember.email)) {
          setToastMessage("Member already added!");
          setShowToast(true);
          return;
        }
  
      setMembers([...members, newMember]);
      setMemberInput('');
    }
  };


  const handleCreate = async () => {
    try {
      const response = await axios.post(
        "/teams/admin/create-team",
        {
          groupName,
          supervisorId,
          maxNumber: parseInt(maxNumber, 10),
        },
        {
          withCredentials: true,
        }
      );
  
      if (response.data.status === "success") {
        console.log("Team created:", response.data.team);
        // Optionally show success toast or update UI

        const createdTeamId = response.data.team.id;
        setSelectedTeam(createdTeamId);
        
        
        const memberIds = members
        .map((member) => member.id)
         .filter((id) => id !== null);
      
        axios.patch('/teams/move-student', {
          //studentIds: [memberIds],  memberIds is already an array no need to wrap it in another array
          studentIds: memberIds,
          newTeamId: createdTeamId
        }, { withCredentials: true
        })
        .then(res => {
          
          onClose(); // Close modal
        })
        .catch(err => {
          console.error(err);
          
        });




        onClose();
      }
    } catch (error) {
      console.error("Error creating team:", error.response?.data || error.message);
      
      // Optionally show error toast
      onClose();
    }
  };

  useEffect(() => {
    console.log("studetns prop receiverd :" , students);

  }, [students]);


  if (!show) return null;
 
  return (
    <div className={Style["modal-overlay"]}>
      <div className={`${Style["modal-content"]} ${Style["create-team-modal"]}`}>
        <h2>Create Team </h2>
        <p className={Style["create-team-subtitle"]}>
          Create your own team and kickstart your journey! You can start solo and invite members later, or send invitations right away to build your dream team.
        </p>


        {/* Input for adding members */}
        {/* <input
                          id="groupName"
                          type="text"
                          placeholder="Enter the name of the group"
                          className={Style["add-member-row"]}
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                        />
        
        <input
                          id="supervisorId"
                          type="text"
                          placeholder="Enter the Supervisor ID"
                          className={Style["add-member-row"]}
                          value={supervisorId}
                          onChange={(e) => setSupervisorId(e.target.value)}
                        /> */}
                         <input
                          id="maxMembers"
                          type="number"
                          placeholder="Enter the max number of membbers"
                          className={Style["add-member-row"]}
                          value={maxNumber}
                          onChange={(e) => setMaxNumber(e.target.value)}
                        />
                        
        
        <div className={Style["add-member-row"]}>
          <input
            type="text"
            placeholder="Add member by name or email"
            className={Style["add-member-input"]}
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
          />
          {memberInput && (
              <div className={Style["suggestions-list"]}>
                {students
                  .filter((student) => {
                    const matchesText = `${student.fullName} ${student.email}`.toLowerCase().includes(memberInput.toLowerCase());
                    const matchesFilter = members.length === 0 ||
                      (student.year === members[0].year && student.specialite === members[0].specialite);
                    return matchesText && matchesFilter;
                  })
                  .slice(0, 10)
                  .map((student, index) => (
                    <div
                      key={index}
                      className={Style["suggestion-item"]}
                      onClick={() => setMemberInput(student.email)}
                    >
                      {student.fullName} ({student.email}) ({student.year}) ({student.specialite})
                    </div>
                  ))
                }

                {/* Show "no matches" fallback if no students matched */}
                {students.filter((student) => {
                    const matchesText = `${student.fullName} ${student.email}`.toLowerCase().includes(memberInput.toLowerCase());
                    const matchesFilter = members.length === 0 ||
                      (student.year === members[0].year && student.specialite === members[0].specialite);
                    return matchesText && matchesFilter;
                  }).length === 0 && (
                    <div className={Style["suggestion-item"]}>
                      There are no matching students for the year: <strong>{members[0]?.year || "any"}</strong> and speciality: <strong>{members[0]?.specialite || "any"}</strong>.
                    </div>
                  )}
              </div>
            )}

          <button className={Style["invite-button"]} onClick={addMember}>
            Add
          </button>
        </div>

        {/* Members list */}
        <div className={Style["members-list"]}>
          <h3>Members</h3>
          {members.map((member, index) => (
            <div key={index} className={Style["member-row"]}>
              <span className={Style["member-email"]}> {member.fullName} ({member.email}) ({member.year}) ({member.specialite})</span>
              <button
                className={Style["remove-member-btn"]}
                onClick={() => {
                  const updatedMembers = members.filter((_, i) => i !== index);
                  setMembers(updatedMembers);
                }}
              >
                –
              </button>
            </div>
          ))}
        </div>

        {/* Conditional Alerts */}
        {showAlert && (
          <div className={Style["alert"]}>
            You must join a team before inviting others.
          </div>
        )}
        
        {/* Action buttons */}
        <div className={Style["modal-actions"]}>
          <button className={Style["cancel-button"]} onClick={onClose}>
            Cancel
          </button>
          <button className={Style["create-button"]} onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default AdminCreateTeamModal;
