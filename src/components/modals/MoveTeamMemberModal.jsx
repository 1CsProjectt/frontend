import React, { useState ,useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/MoveTeamMemberModal.module.css';
import { Search } from 'lucide-react';
import axios from 'axios';

const MoveTeamMemberModal = ({ isOpen, onClose ,memberIdToMove}) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState([]);// the fetch happens in the modal to improve accuracy of the data


  useEffect(() => {
    /* alert("memberIdToMove: " + JSON.stringify(memberIdToMove, null, 2)); */
    if (isOpen) {
      axios.get('/teams/all')
        .then(res => {
          if (res.data && res.data.teams) {
            setTeams(res.data.teams);
          }
        })
        .catch(err => {
          console.error('Error fetching teams:', err);
        });
    }
  }, [isOpen]);

/*   const teams = [
    { id: '01', name: 'Team Alpha' },
    { id: '02', name: 'Team Beta' },
    { id: '03', name: 'Team Gamma' },
    { id: '04', name: 'Team Delta' },
    { id: '05', name: 'Team Epsilon' },
    { id: '06', name: 'Team Zeta' },
    { id: '07', name: 'Team Eta' },
    { id: '08', name: 'Team Theta' },

  ]; */

  const handleTeamSelect = (e) => setSelectedTeam(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleMove = () => {
    if (!selectedTeam ) {
      alert("Please select a team first");
      return;
    }else {
      alert("Moving member of id :" + memberIdToMove + " to team id :" + selectedTeam);
    }

  
    axios.patch('/teams/move-student', {
      studentIds: [memberIdToMove],
      newTeamId: selectedTeam
    })
    .then(res => {
      alert("Member moved successfully!");
      onClose(); // Close modal
    })
    .catch(err => {
      console.error(err);
      alert(err.response?.data?.message || "Failed to move member.");
    });
  };
  

/*   const filteredTeams = teams.filter(team =>  
    team.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  ); */
  const filteredTeams = teams.filter(team =>
    (team.id && team.id.toString().includes(searchQuery)) ||
    (team.name && team.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Move a member</h2>
        <p className={styles.description}>
          Seamlessly reassign team members. Move individuals to different teams to optimize
          collaboration and ensure the right people are in the right places.
        </p> 
        

        <div className={styles.selectWrapper}>
          <select
            className={styles.select}
            value={selectedTeam}
            onChange={handleTeamSelect}
          >
            <option value="" disabled>Select team by id</option>
            {teams.map(team => (
              <option key={team.id} value={team.id.toString()}> teamID : {team.id}  {team.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.searchWrapper}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Search..."
              className={styles.input}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className={styles.icon}><Search size={16} /></div>
          </div>
          <div className={styles.resultList}>
            {filteredTeams.map((team) => (  
              <div key={team.id} className={styles.resultItem}  onClick={() => setSelectedTeam(team.id.toString())}>
                {/* {team.id} - {team.name} */}     
                {team.id}
              </div>
            ))}
            {filteredTeams.length === 0 && (
           <div className={styles.resultItem}>No teams found</div>
           )}
           
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button className={styles.moveButton} onClick={handleMove}>move</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MoveTeamMemberModal;
