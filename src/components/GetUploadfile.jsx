import React from "react";

import Module from "../styles/StudentMeetingPage.module.css";

import FileIcon from "../assets/fileIcon.svg";
import ArrowIcon from "../assets/expand_less_black.svg";
export function GetUploadfile({ title, dic, pdfFile }) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "3vh",
            alignItems: "flex-end",
            borderBottom: "2px solid #dde2e4",
            paddingBottom: "2vh"
        }}>
            {!pdfFile ? (
                <div>
                    <span className={Module["file-name"]} style={{ marginLeft: "3vw" }}>
                        No support files uploaded
                    </span>
                </div>
            ) : (
                <div style={{ marginLeft: "3vw" }}>
                    <a
                        href={pdfFile}
                        target="_blank"                   /* opens in new tab */
                        rel="noopener noreferrer"         /* security best practice */
                        className={Module["technical-sheet"]}
                    >
                        <div className={Module["technical-sheet-info"]}>
                            <img
                                src={FileIcon}
                                alt="PDF Icon"
                                className={Module["file-icon"]}
                            />
                            <div>
                                <span className={Module["file-name"]}>
                                    SoutenanceSchedule.pdf
                                </span>
                                <span className={Module["file-size"]}>
                                    Size not available
                                </span>
                            </div>
                        </div>
                        <img
                            src={ArrowIcon}
                            alt="Open Arrow"
                            className={Module["arrow-icon"]}
                        />
                    </a>
                </div>
            )}

            <div className={Module["UploadRight-side"]} style={{
                marginLeft: "auto",
                maxWidth: "23vw",
                marginRight: "4vw"
            }}>
                <div className={Module["Left-side-header"]}>{title}</div>
                <div className={Module["Left-side-body"]}>{dic}</div>
            </div>
        </div>
    );
}