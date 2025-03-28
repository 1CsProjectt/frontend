import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/NavBar";
import FileIcon from "../assets/fileIcon.svg";
import ArrowIcon from "../assets/expand_less_black.svg";
import "../styles/ExplorePage.css";

export default function ExplorePage() {
  const [project] = useState({
    title: "Smart Task Management System For Collaboration",
    description:
      "A Smart Task Management System for team collaboration is designed to improve productivity and efficiency by providing a structured approach to task allocation and tracking. It enables teams to create, assign, and prioritize tasks while ensuring clear visibility into project progress. With real-time notifications and automated reminders, team members stay updated on deadlines and responsibilities, reducing delays and miscommunication. The system also integrates with various tools and platforms, allowing seamless workflow management across different departments and remote teams.                                                 By leveraging AI-driven insights and automation, the system optimizes workload distribution and enhances decision-making. Advanced analytics help managers track team performance, identify bottlenecks, and allocate resources effectively. Collaborative features such as shared workspaces, file attachments, and discussion threads ensure smooth communication and teamwork. Whether for small teams or large organizations, this system fosters a more organized, transparent, and productive work environment.",
    imageUrl:
      "https://s3-alpha-sig.figma.com/img/b836/db4b/d86a1d2a84cbf52dbe276f0a518a915b?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=h-M8EzpW0kGhseSTgdEcZvafbrbK-ucxl6qoV7S7yXCg1CFKecCa4hzCVKbnV6DCzlgRGnvCDT7ZjHhQx~q-xTkFha4K2l3Ce3VJC4b2zfuBPnslzhy7cM7HA14ooFIjUXkxs8ozL2cLaXK61m44eME1h281XJakc076X6ABpfQx4vJywnc-l4Lg-s9TUkaCzE-ShMYqSrJxbqi28xfpy9mJSwSu95MvnBTHF67mSc4NirffUm-~b6439uROMdBaSAeXCk~~r41nBCwzcH~-39haisuxfa5wIIfWGUN8N0Yg1Ye~kOzIGP5oFQnvXgMLmUqY7nLr2aSW2AuhactEog__",
    supervisors: ["Guessoum Mohamed Nizar", "Kameouche Abderrahmane", "Yettou Abdallah"],
    technicalSheet: {
      name: "TechnicalSheet.Pdf",
      size: "1.4 mb",
      link: "/path/to/Technical_Sheet.pdf",
    },
  });

  return (
    <div className="explore-container">
      <Sidebar />
      <div className="explore-content">
        <Navbar />
        <h1 className="title">Exploring</h1>
        <div className="banner-wrapper">
          <img src={project.imageUrl} alt="Project Banner" className="project-banner" />
        </div>

        <div className="project-details">
          <h1 className="project-title">{project.title}</h1>
          <p className="project-description">{project.description}</p>

          <h2 className="section-heading">Supervisors</h2>
          <ul className="supervisors-list">
            <p>Here is a list of supervisors who will assist in developing this project, along with the publisher of this topic.</p>
            {project.supervisors.map((supervisor, index) => (
              <li key={index}>{supervisor}</li>
            ))}
          </ul>

          <h2 className="section-heading">Technical Sheet</h2>
          <a href={project.technicalSheet.link} download className="technical-sheet">
            <div className="technical-sheet-info">
              <img src={FileIcon} alt="PDF Icon" className="file-icon" />
              <div>
                <span className="file-name">{project.technicalSheet.name}</span>
                <span className="file-size">{project.technicalSheet.size}</span>
              </div>
            </div>
            <img src={ArrowIcon} alt="Right Arrow" className="arrow-icon" />
          </a>

        </div>
      </div>
    </div>
  );
}
