import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import Style from '../../styles/AdminManagePreferencesPage.module.css';
import Toast from './Toast';

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const AdminCreateTeamModal = ({ show, onClose,students}) => {

  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
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
      setShowToast(false);
      setToastMessage('');
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
        ? { id: matchedStudent.id, email: matchedStudent.email, fullName: matchedStudent.fullName }
        : { id: null ,email: memberInput, fullName: memberInput }; // fallback if unmatched

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

        if (!createdTeamId) {
          alert("Please create a team first.");
          return;
        }
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
          alert("Member moved successfully!");
          onClose(); // Close modal
        })
        .catch(err => {
          console.error(err);
          alert(err.response?.data?.message || "Failed to move member.");
        });




        onClose();
      }
    } catch (error) {
      console.error("Error creating team:", error.response?.data || error.message);
      alert("Error creating team: " + (error.response?.data?.message || error.message));
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
        <input
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
                        />
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
                .filter((student) =>
                  `${student.fullName} ${student.email}`.toLowerCase().includes(memberInput.toLowerCase())
                )
                .slice(0, 10) // limit suggestions
                .map((student, index) => (
                  <div
                    key={index}
                    className={Style["suggestion-item"]}
                    onClick={() => {
                      // setMemberInput(`${student.fullName} <${student.email}>`);  the email here contains both the name and email
                      setMemberInput(student.email);
                      // You can auto-add here if desired
                     /*  setMembers([...members, { email: student.email }]);  //using these lines will add the member to the list automatically when the suggestion item is clicked
                      setMemberInput(""); */
                    }}
                  >
                    {student.fullName} ({student.email})
                  </div>
                ))}
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
              <span className={Style["member-email"]}> {member.fullName} ({member.email})</span>
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
        {showToast && (
          <div className={Style["toast"]}>
            Invitation sent successfully!
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
      {showToast && (
        <Toast message={toastMessage || "Test Toast"} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default AdminCreateTeamModal;
