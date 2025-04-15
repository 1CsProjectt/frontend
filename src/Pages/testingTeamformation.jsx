import React, { useState, useEffect } from "react";
// import axios from "axios"; // No longer needed for dummy data
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import StudentsListTab from "../components/StudentsListTab";
import ExistedTeamsTab from "../components/ExistedTeamsTab";
import MyTeamTab from "../components/MyTeamTab";
import CreateTeamModal from "../components/modals/CreateTeamModal";
import Toast from "../components/modals/Toast";
import JoinTeamModal from "../components/modals/JoinTeamAlert";
import Style from "../styles/TeamFormationPage.module.css";
import LeaveTeamPopup from "../components/modals/LeaveTeamPopup";

// Dummy data for demonstration
const dummyStudents = [
  {
    firstname: "Ahmed",
    lastname: "Benzema",
    user: { email: "ahmed.benzema@example.com" },
    status: "available"
  },
  {
    firstname: "Fatima",
    lastname: "Zohra",
    user: { email: "fatima.zohra@example.com" },
    status: "available"
  },
  {
    firstname: "Mohamed",
    lastname: "Belkacem",
    user: { email: "mohamed.belkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Yasmine",
    lastname: "Boualem",
    user: { email: "yasmine.boualem@example.com" },
    status: "Full"
  },
  {
    firstname: "Rachid",
    lastname: "Khelifa",
    user: { email: "rachid.khelifa@example.com" },
    status: "Full"
  },
  {
    firstname: "Nour",
    lastname: "Amrani",
    user: { email: "nour.amrani@example.com" },
    status: "Full"
  },
  {
    firstname: "Samir",
    lastname: "Boukhalfa",
    user: { email: "samir.boukhalfa@example.com" },
    status: "Full"
  },
  {
    firstname: "Amina",
    lastname: "Cherif",
    user: { email: "amina.cherif@example.com" },
    status: "available"
  },
  {
    firstname: "Karim",
    lastname: "Saadi",
    user: { email: "karim.saadi@example.com" },
    status: "available"
  },
  {
    firstname: "Lina",
    lastname: "Meziane",
    user: { email: "lina.meziane@example.com" },
    status: "available"
  },
  {
    firstname: "Hassan",
    lastname: "Bouras",
    user: { email: "hassan.bouras@example.com" },
    status: "available"
  },
  {
    firstname: "Sofia",
    lastname: "Benali",
    user: { email: "sofia.benali@example.com" },
    status: "available"
  },
  {
    firstname: "Walid",
    lastname: "Hamdi",
    user: { email: "walid.hamdi@example.com" },
    status: "available"
  },
  {
    firstname: "Imane",
    lastname: "Ziani",
    user: { email: "imane.ziani@example.com" },
    status: "available"
  },
  {
    firstname: "Nadir",
    lastname: "Boudjemaa",
    user: { email: "nadir.boudjemaa@example.com" },
    status: "Full"
  },
  {
    firstname: "Salima",
    lastname: "Bachir",
    user: { email: "salima.bachir@example.com" },
    status: "available"
  },
  {
    firstname: "Adel",
    lastname: "Mokhtar",
    user: { email: "adel.mokhtar@example.com" },
    status: "available"
  },
  {
    firstname: "Khadija",
    lastname: "Bensalem",
    user: { email: "khadija.bensalem@example.com" },
    status: "Full"
  },
  {
    firstname: "Yacine",
    lastname: "Haddad",
    user: { email: "yacine.haddad@example.com" },
    status: "available"
  },
  {
    firstname: "Noura",
    lastname: "Belaid",
    user: { email: "noura.belaid@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },,
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  },
  {
    firstname: "Fouad",
    lastname: "Djebbar",
    user: { email: "fouad.djebbar@example.com" },
    status: "available"
  },
  {
    firstname: "Leila",
    lastname: "Messaoudi",
    user: { email: "leila.messaoudi@example.com" },
    status: "Full"
  },
  {
    firstname: "Hakim",
    lastname: "Benkacem",
    user: { email: "hakim.benkacem@example.com" },
    status: "available"
  },
  {
    firstname: "Amel",
    lastname: "Touati",
    user: { email: "amel.touati@example.com" },
    status: "Full"
  },
  {
    firstname: "Riad",
    lastname: "Boussaid",
    user: { email: "riad.boussaid@example.com" },
    status: "available"
  },
  {
    firstname: "Samiha",
    lastname: "Bourouba",
    user: { email: "samiha.bourouba@example.com" },
    status: "Full"
  },
  {
    firstname: "Zinedine",
    lastname: "Brahimi",
    user: { email: "zinedine.brahimi@example.com" },
    status: "available"
  },
  {
    firstname: "Hiba",
    lastname: "Mekhloufi",
    user: { email: "hiba.mekhloufi@example.com" },
    status: "Full"
  }
];
const dummyExistedTeams = [
  {
    id: 1,
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  },
  {
    id: 2,
    members: [
      { firstname: "Dave", lastname: "Williams" },
      { firstname: "Eva", lastname: "Jones" }
    ],
    maxNumber: 2
  },
  {
    id: 3,
    members: [
      { firstname: "Dave", lastname: "Williams" },
      { firstname: "Eva", lastname: "Jones" }
    ],
    maxNumber: 2
  },
  {
    id: 4,
    members: [
      { firstname: "Dave", lastname: "Williams" },
      { firstname: "Eva", lastname: "Jones" }
    ],
    maxNumber: 2
  },
  {
    id: 5,
    members: [
      { firstname: "Dave", lastname: "Williams" },
      { firstname: "Eva", lastname: "Jones" }
    ],
    maxNumber: 2
  },
  {
    id: 6,
    members: [
      { firstname: "Dave", lastname: "Williams" },
      { firstname: "Eva", lastname: "Jones" }
    ],
    maxNumber: 5
  },
  {
    id: 7,
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  },
  {
    id: 8,
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  },
  {
    id: 9,
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  },
  {
    id: 10,
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  },
  {
    id: 11,
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  },
  {
    id: 12,
    members: [{ firstname: "Charlie", lastname: "Brown" }],
    maxNumber: 3
  },
  {
    id: 13,
    members: [
      { firstname: "Sophia", lastname: "Taylor" },
      { firstname: "Liam", lastname: "Brown" }
    ],
    maxNumber: 4
  },
  {
    id: 14,
    members: [
      { firstname: "Olivia", lastname: "Wilson" },
      { firstname: "Noah", lastname: "Davis" },
      { firstname: "Emma", lastname: "Moore" }
    ],
    maxNumber: 5
  },
  {
    id: 15,
    members: [
      { firstname: "Mason", lastname: "Clark" },
      { firstname: "Ava", lastname: "Hall" }
    ],
    maxNumber: 3
  },
  {
    id: 16,
    members: [
      { firstname: "Isabella", lastname: "Adams" },
      { firstname: "Lucas", lastname: "Baker" },
      { firstname: "Mia", lastname: "Carter" }
    ],
    maxNumber: 4
  },
  {
    id: 17,
    members: [
      { firstname: "Ethan", lastname: "Evans" },
      { firstname: "Amelia", lastname: "Harris" }
    ],
    maxNumber: 2
  },
  {
    id: 18,
    members: [
      { firstname: "James", lastname: "Martin" },
      { firstname: "Charlotte", lastname: "Thompson" },
      { firstname: "Benjamin", lastname: "Garcia" }
    ],
    maxNumber: 5
  },
  {
    id: 19,
    members: [
      { firstname: "Elijah", lastname: "Martinez" },
      { firstname: "Harper", lastname: "Robinson" }
    ],
    maxNumber: 3
  },
  {
    id: 20,
    members: [
      { firstname: "Alexander", lastname: "Lee" },
      { firstname: "Avery", lastname: "Walker" },
      { firstname: "William", lastname: "Young" }
    ],
    maxNumber: 4
  }
];

const dummyMyTeam =  {
  id: 1,
  members: [{
    firstname: "Alice",
    lastname: "Johnson",
    user: { email: "alice@example.com" },
    role: "Leader",
  },
  {
    firstname: "Bob",
    lastname: "Smith",
    user: { email: "bob@example.com" },
    role: "Member",
  },{
    firstname: "Alice",
    lastname: "Johnson",
    user: { email: "alice@example.com" },
    role: "Leader",
  },
  {
    firstname: "Bob",
    lastname: "Smith",
    user: { email: "bob@example.com" },
    role: "Member",
  },{
    firstname: "Alice",
    lastname: "Johnson",
    user: { email: "alice@example.com" },
    role: "Leader",
  },
  {
    firstname: "Bob",
    lastname: "Smith",
    user: { email: "bob@example.com" },
    role: "Member",
  },{
    firstname: "Alice",
    lastname: "Johnson",
    user: { email: "alice@example.com" },
    role: "Leader",
  },
  {
    firstname: "Bob",
    lastname: "Smith",
    user: { email: "bob@example.com" },
    role: "Member",
  },]
};
  


const dummyPendingInvites = [
  {
    sender: {
      firstname: "1Alice",
      lastname: "Johnson",
      team_id: "7",
    },
    receiver_email: "1charlie@example.com",
  },{
    sender: {
      firstname: "2Alice",
      lastname: "Johnson",
      team_id: "9",
    },
    receiver_email: "2charlie@example.com",
  },{
    sender: {
      firstname: "3Alice",
      lastname: "Johnson",
      team_id: "17",
    },
    receiver_email: "3charlie@example.com",
  },{
    sender: {
      firstname: "1Alice",
      lastname: "Johnson",
      team_id: "7",
    },
    receiver_email: "1charlie@example.com",
  },{
    sender: {
      firstname: "2Alice",
      lastname: "Johnson",
      team_id: "9",
    },
    receiver_email: "2charlie@example.com",
  },{
    sender: {
      firstname: "3Alice",
      lastname: "Johnson",
      team_id: "17",
    },
    receiver_email: "3charlie@example.com",
  }
];

const dummyCollaborationInvites = [
  {
    sender: {
      firstname: "Diana",
      lastname: "Prince",
      team_id: "9",
      user: { email: "diana@example.com" },
    },
    email: "diana@example.com", // fallback
  },
  {
    sender: {
      firstname: "Clark",
      lastname: "Kent",
      team_id: "5",
      user: { email: "clark@example.com" },
    },
    email: "clark@example.com",
  },
];

function TeamFormationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Students List");
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeaveTeamPopup, setShowLeaveTeamPopup] = useState(false); 
  const [students, setStudents] = useState([]);
  const [existedTeams, setExistedTeams] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [myTeamPendingInvites, setMyTeamPendingInvites] = useState([]);
  const [collaborationInvites, setCollaborationInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const session = {title : "Group formation session",date : {start : new Date("2025-04-9T00:00:00"),
    end : new Date("2025-04-29T23:59:59") }}
 

  // Handle leaving team actions
  const handleJoinClick = () => {
    setShowLeaveTeamPopup(true);
    console.log("leave clicked");
  };

  const handleCancel = () => {
    setShowLeaveTeamPopup(false);
  };

  const handleConfirm = () => {
    setShowLeaveTeamPopup(false);
    // Simulate leave action
    console.log("leave confirmed!");
    setToastMessage("Team leaving was successful.");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    setLoading(true);
    setError("");

    // Simulate an API call delay
    setTimeout(() => {
      if (activeTab === "Students List") {
        setStudents(dummyStudents);
      } else if (activeTab === "Existed Teams") {
        // Add a status to each team (for demonstration)
        const teamsWithStatus = dummyExistedTeams.map(team => ({
          ...team,
          status: team.members.length === team.maxNumber ? "full" : "open"
        }));
        setExistedTeams(teamsWithStatus);
      } else if (activeTab === "My Team") {
        setMyTeam(dummyMyTeam);
        console.log("my team", dummyMyTeam);
        if (dummyMyTeam.id) {
          setMyTeamPendingInvites(dummyPendingInvites);
        } else {
          setCollaborationInvites(dummyCollaborationInvites);
        }
      }
      setLoading(false);
    }, 500);
  }, [activeTab]);

  // --- Filtering and suggestions for each tab ---
  // For students list tab, format student data as before.
  const formattedStudents = students.map(student => ({
    fullName: `${student.firstname || ""} ${student.lastname || ""}`.trim(),
    email: student.user?.email || "No Email",
    status: student.status || "No Status",
  }));

  // Filter students if in "Students List" tab.
  const filteredStudents = formattedStudents.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // For existed teams, filter by checking if any team member matches the query.
  const filteredTeams = existedTeams.filter(team =>
    team.members.some(member => 
      `${member.firstname} ${member.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Compute suggestions based on active tab.
  let suggestionsList = [];
  if (activeTab === "Students List") {
    suggestionsList = formattedStudents.map(s => s.fullName);
  } else if (activeTab === "Existed Teams") {
    // Flatten team members names and remove duplicates.
    const teamMemberNames = existedTeams.flatMap(team =>
      team.members.map(member => `${member.firstname} ${member.lastname}`)
    );
    suggestionsList = Array.from(new Set(teamMemberNames));
  } else if (activeTab === "My Team") {
    // When on My Team, disable search by setting suggestions empty.
    suggestionsList = [];
  }

  // Handle search changes only for tabs that need search functionality.
  const handleSearchChange = (query) => {
    if (activeTab === "My Team") {
      // Do not update the searchQuery when on My Team.
      return;
    }
    setSearchQuery(query);
  };

  const renderTabContent = () => {
    if (activeTab === "Students List") {
      return (
        <StudentsListTab 
          user={user} 
          students={filteredStudents} 
          myTeamNumber={myTeam?.groupName || ""}
        />
      );
    } else if (activeTab === "Existed Teams") {
      return (
        <ExistedTeamsTab 
          user={user} 
          existedTeams={filteredTeams} 
          navigate={navigate}
        />
      );
    } else if (activeTab === "My Team") {
      return (
        <MyTeamTab
          myTeamNumber={myTeam?.id}
          myTeamMembers={myTeam?.members || []}
          myTeamPendingInvites={myTeamPendingInvites}
          collaborationInvites={collaborationInvites}
        />
      );
    }
  };

  return (
    <div className={Style["team-formation-page"]}> 
      <Sidebar />
      <div style={{ marginLeft: "16vw" }}>
        <Navbar
          title={session.title}
          targetDate={session.date}
          onSearchChange={handleSearchChange}
         
          suggestions={suggestionsList}
        
         
        />
        <div className={Style["team-formation-container"]}>
          <div className={Style["header-row"]}>
            <h1>Team formation</h1>
            {activeTab === "Existed Teams" && (
              <button className={Style["create-team-button"]} onClick={() => setShowCreateTeamModal(true)}>
                Create a team
              </button>
            )}
            {activeTab === "My Team" && myTeam?.groupName && (
              <button className={Style["Leave-button"]} onClick={handleJoinClick}>
                Leave the team
              </button>
            )}
          </div>

          <div className={Style["tabs"]}>
            {["Students List", "Existed Teams", "My Team"].map(tab => (
              <div
                key={tab}
                className={`${Style["tab-item"]} ${activeTab === tab ? Style.Full : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery(""); // Reset search query when changing tabs
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            renderTabContent()
          )}
        </div>

        <CreateTeamModal
          show={showCreateTeamModal}
          onClose={() => setShowCreateTeamModal(false)}
          onTeamCreated={() => setToastMessage("Team created successfully.")}
          onInviteSent={() => setToastMessage("Invite sent successfully.")}
        />
        <LeaveTeamPopup
          show={showLeaveTeamPopup}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
        {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
      </div>
    </div>
  );
}

export default TeamFormationPage;