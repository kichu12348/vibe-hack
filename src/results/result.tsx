import React from "react";
import { FaTrophy, FaMedal, FaAward, FaCrown, FaHeart } from "react-icons/fa";
import styles from "./result.module.css";

interface Winner {
  position: number;
  teamName: string;
  projectName: string;
  icon: React.ReactNode;
}

const winners: Winner[] = [
  {
    position: 2,
    teamName: "Team Tetrons",
    projectName: "Accesschain",
    icon: <FaTrophy />,
  },
  {
    position: 1,
    teamName: "Team Respawn",
    projectName: "Newsflix",
    icon: <FaCrown />,
  },
  {
    position: 3,
    teamName: "Team Spectre",
    projectName: "Dozy",
    icon: <FaMedal />,
  },
];

function Result() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img
            src="/logos/iedc_logo.svg"
            alt="IEDC Logo"
            className={styles.logo}
          />
          <img
            src="/logos/ksum_logo.svg"
            alt="KSUM Logo"
            className={styles.logo}
          />
          <img
            src="/logos/cec_logo.svg"
            alt="CEC Logo"
            className={styles.logo}
          />
          <img
            src="/logos/we_cell_logo.svg"
            alt="WE Cell Logo"
            className={styles.logo}
          />
        </div>

        <h1 className={styles.title}>
          VIBE CODING <span className={styles.highlight}>RESULTS</span>
        </h1>
      </header>
      <main>
        <div className={styles.resultsScreen}>
          <div className={styles.resultsContent}>
            <h2 className={styles.subtitle}>
              <span className={styles.highlight}>WINNERS</span>
              <br />
              ANNOUNCEMENT
            </h2>

            <div className={styles.winnersContainer}>
              {winners.map((winner, index) => (
                <div
                  key={winner.position}
                  className={`${styles.winnerCard} ${
                    styles[`position${winner.position}`]
                  } ${styles[`podiumPosition${index + 1}`]}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={styles.winnerRank}>
                    <div className={styles.rankIcon}>{winner.icon}</div>
                    <div className={styles.rankText}>
                      {winner.position === 1
                        ? "1ST PLACE"
                        : winner.position === 2
                        ? "2ND PLACE"
                        : "3RD PLACE"}
                    </div>
                  </div>

                  <div className={styles.winnerInfo}>
                    <h3 className={styles.teamName}>{winner.teamName}</h3>
                    <h4 className={styles.projectName}>{winner.projectName}</h4>
                  </div>

                  <div className={styles.winnerBadge}>
                    <FaAward
                      className={styles.badgeIcon}
                      style={{
                        color:
                          winner.position === 1
                            ? "#ffd700"
                            : winner.position === 2
                            ? "#c0c0c0"
                            : "#cd7f32",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.congratsSection}>
              <p className={styles.congratsMessage}>
                Thank you to all participants who made this hackathon amazing!{" "}
                <FaHeart className={styles.heartIcon} />
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          © {new Date().getFullYear()} VIBE CODING HACK+ATHON. All rights
          reserved.
        </p>
        <p>Organized by IEDC BOOTCAMP CEC & WE Cell</p>
      </footer>
    </div>
  );
}

export default Result;
