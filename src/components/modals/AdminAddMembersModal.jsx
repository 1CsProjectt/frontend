import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import Style from '../../styles/AdminManagePreferencesPage.module.css';
import Toast from './Toast';

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const AddMembersModal = ({ show, onClose,students,selectedTeamID,year,specialite}) => {

  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [supervisorId, setSupervisorId] = useState(null);
  const [maxNumber, setMaxNumber] = useState("5"); 
  
  useEffect(() => {
    if (show) {
      // Clear all input fields and state when modal opens
      setMemberInput('');
      setMembers([]);
      setGroupName('');
      setSupervisorId(null);
      setMaxNumber('5');
     
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




  const handleAdd = async () => {
   
  
     
      

        if (selectedTeamID === null) {
          alert("Error: No team ID found.");
          return;
        }
        const memberIds = members
        .map((member) => member.id)
         .filter((id) => id !== null);
      
        axios.patch('/teams/move-student', {
          //studentIds: [memberIds],  memberIds is already an array no need to wrap it in another array
          studentIds: memberIds,
          newTeamId: selectedTeamID
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
   
  };


  useEffect(() => {
    console.log("studetns prop receiverd for AddMembersModal :" , students);

  }, [students]);


  if (!show) return null;
 
  return (
    <div className={Style["modal-overlay"]}>
      <div className={`${Style["modal-content"]} ${Style["create-team-modal"]}`}>
        <h2>Adding Members </h2>
        <p className={Style["create-team-subtitle"]}>
        Add new members to any team, assign roles, and build a strong, collaborative workspace.
        </p>
  
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
                              const matchesFilter = student.year === year && student.specialite === specialite;
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
                              const matchesFilter = student.year === year && student.specialite === specialite;

                              return matchesText && matchesFilter;
                            }).length === 0 && (
                              <div className={Style["suggestion-item"]}>
                                There are no matching students for the year: <strong>{year || "any"}</strong> and speciality: <strong>{specialite || "any"}</strong>.
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



        {/* Action buttons */}
        <div className={Style["modal-actions"]}>
          <button className={Style["cancel-button"]} onClick={onClose}>
            Cancel
          </button>
          <button className={Style["create-button"]} onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
      {showToast && (
        <Toast message={toastMessage || "Test Toast"} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default AddMembersModal;
