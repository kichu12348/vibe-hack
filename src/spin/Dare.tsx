import React, { useState, useEffect, useRef } from "react";
import styles from "./dare.module.css";
import appStyles from "../App.module.css";
import {
  FaChevronDown,
  FaTimes,
  FaEye,
  FaCheck,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import { FaRegHourglassHalf } from "react-icons/fa6";

const API_URL = import.meta.env.VITE_API_URL;

interface AllTeamsApiResponse {
  id: number;
  team_name: string;
}

interface Dare {
  id: number;
  dare: string;
  points: number;
}

interface ChosenDare {
  id: string;
  dare: string;
  points: number;
}

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "loading";
  isLoading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  isLoading = false,
}) => {
  if (!isOpen) return null;
  const styles = appStyles;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className={styles.modalIconSuccess} />;
      case "error":
        return <FaExclamationTriangle className={styles.modalIconError} />;
      case "warning":
        return <FaExclamationTriangle className={styles.modalIconWarning} />;
      case "loading":
        return <FaRegHourglassHalf className={styles.modalIconLoading} />;
      default:
        return null;
    }
  };

  const checkForBubbleMessage = message.includes("Dare ID: *");

  return (
    <div
      className={styles.modalOverlay}
      onClick={isLoading ? undefined : onClose}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleContainer}>
            {getIcon()}
            <h3 className={styles.modalTitle}>{title}</h3>
          </div>
          {!isLoading && (
            <button className={styles.modalCloseButton} onClick={onClose}>
              <FaTimes />
            </button>
          )}
        </div>
        <div className={styles.modalBody}>
          <p className={styles.modalMessage}>
            {checkForBubbleMessage ? (
              <>
                {message.split("*")[0].trim()}{" "}
                <span
                  className={styles.bubbleMessage}
                  title="This is your Dare ID. Save it for submission."
                  onClick={() => {
                    navigator.clipboard.writeText(message.split("*")[1].trim());
                    alert("Dare ID copied to clipboard!");
                  }}
                >
                  {message.split("*")[1].trim()}
                </span>
                {message.split("*")[2].trim()}
              </>
            ) : (
              message
            )}
          </p>
        </div>
        <div className={styles.modalFooter}>
          {!isLoading && (
            <button className={styles.modalOkButton} onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Dropdown: React.FC<DropdownProps> = ({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const styles = appStyles;

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`${styles.dropdown} ${className}`}
      style={{ padding: 0, border: "none", background: "transparent" }}
    >
      <div
        className={styles.dropdownTrigger}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.dropdownValue}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaChevronDown
          className={`${styles.dropdownIcon} ${
            isOpen ? styles.dropdownIconOpen : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu} role="listbox">
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.dropdownOption} ${
                option.value === value ? styles.dropdownOptionSelected : ""
              }`}
              onClick={() => handleOptionClick(option.value)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

async function fetchDares(): Promise<Dare[]> {
  const response = await fetch(`${API_URL}/get-dares`);
  if (!response.ok) {
    throw new Error("Failed to fetch dares");
  }
  const { dares } = await response.json();
  return dares;
}

async function chooseDare(dareId: number, teamId: number): Promise<ChosenDare> {
  const response = await fetch(`${API_URL}/get-dare/${dareId}/team/${teamId}`);
  if (!response.ok) {
    throw new Error("Failed to choose dare");
  }
  const { dare } = await response.json();
  return dare;
}

async function fetchAllTeams(): Promise<AllTeamsApiResponse[] | void> {
  const response = await fetch(`${API_URL}/get-all-teams`);
  if (!response.ok) {
    throw new Error("Failed to fetch teams");
  }
  const { teams } = await response.json();
  return teams;
}

export default function Dare() {
  const [teams, setTeams] = useState<AllTeamsApiResponse[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [dares, setDares] = useState<Dare[]>([]);
  const [revealedDare, setRevealedDare] = useState<Dare | null>(null);
  const [chosenDare, setChosenDare] = useState<ChosenDare | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDares, setLoadingDares] = useState(false);
  const [choosingDare, setChoosingDare] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDareBeenChosen, setHasDareBeenChosen] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "warning" | "loading",
    isLoading: false,
  });

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await fetchAllTeams();
        if (teamsData) {
          setTeams(teamsData);
        }
      } catch (error) {
        setError("Failed to load teams. Please refresh the page.");
        console.error("Error loading teams:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  useEffect(() => {
    const loadDares = async () => {
      if (!selectedTeam) return;

      setLoadingDares(true);
      try {
        const daresData = await fetchDares();
        setDares(daresData);
      } catch (error) {
        setError("Failed to load dares. Please refresh the page.");
        console.error("Error loading dares:", error);
      } finally {
        setLoadingDares(false);
      }
    };

    loadDares();
  }, [selectedTeam]);

  const showModal = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "loading" = "success",
    isLoading: boolean = false
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      isLoading,
    });
  };

  const closeModal = () => {
    setModal({
      ...modal,
      isOpen: false,
    });
  };

  const handleCardClick = (cardIndex: number) => {
    if (selectedCard !== null || loadingDares || chosenDare) return;

    setSelectedCard(cardIndex);
    setRevealedDare(dares[cardIndex]);
  };

  const handleViewMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (revealedDare) {
      showModal(
        `Dare #${revealedDare.id}`,
        `${revealedDare.dare}\n\nPoints: ${revealedDare.points}`,
        "success"
      );
    }
  };

  const handleChooseDare = async () => {
    if (!revealedDare || !selectedTeam || choosingDare) return;

    setChoosingDare(true);
    showModal(
      "Choosing Dare...",
      "Please wait while we process your dare selection.",
      "loading",
      true
    );

    try {
      const result = await chooseDare(revealedDare.id, selectedTeam);
      setChosenDare(result);
      closeModal();

      const teamName =
        teams.find((t) => t.id === selectedTeam)?.team_name || "";
      showModal(
        "Dare Selected!",
        `Team: ${teamName}\n\nYour Dare ID: *${result.id}*\n\nSave this ID! You'll need it for dare submission.\n\nDare: ${result.dare}\n\nPoints: ${result.points}`,
        "success"
      );
    } catch (error) {
      console.error("Error choosing dare:", error);
      closeModal();
      showModal("Error", "Failed to choose dare. Please try again.", "error");
    } finally {
      setChoosingDare(false);
    }
  };

  const resetGame = () => {
    setSelectedCard(null);
    setHasDareBeenChosen(false);
    setChoosingDare(false);
    setRevealedDare(null);
    setChosenDare(null);
    closeModal();
  };

  const getCardSize = (dare: Dare | null) => {
    if (!dare) return "normal";
    const descriptionLength = dare.dare.length;
    if (descriptionLength > 80) return "large";
    if (descriptionLength > 50) return "medium";
    return "normal";
  };

  const getTruncatedDescription = (
    description: string,
    maxLength: number = 60
  ) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  if (loading) {
    return <div className={styles.loading}>Loading teams...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dareContainer}>
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
          DARE
          <br />
          <span className={styles.highlight}>CHALLENGE</span>
        </h1>
      </header>

      <main>
        <div className={styles.gameScreen}>
          <div className={styles.gameScreenContent}>
            {!selectedTeam ? (
              <div className={styles.teamSelection}>
                <h2 className={styles.subtitle}>
                  <span className={styles.highlight}>SELECT YOUR</span>
                  <br />
                  TEAM
                </h2>
                <Dropdown
                  value={selectedTeam?.toString() || ""}
                  options={teams.map((team) => ({
                    value: team.id.toString(),
                    label: team.team_name,
                  }))}
                  onChange={(value) => setSelectedTeam(Number(value))}
                  placeholder="Select your team"
                  className={styles.dropdown}
                />
              </div>
            ) : (
              <div className={styles.gameContent}>
                <div className={styles.gameHeader}>
                  <h2 className={styles.subtitle}>
                    <span className={styles.highlight}>TEAM:</span>{" "}
                    {teams.find((t) => t.id === selectedTeam)?.team_name}
                  </h2>
                  <p className={styles.gameInstruction}>
                    {loadingDares
                      ? "Loading dares..."
                      : "Choose a card to reveal your dare!"}
                  </p>
                </div>

                <div className={styles.cardsWrapper}>
                  <div className={styles.cardsContainer}>
                    {[0, 1, 2].map((cardIndex) => (
                      <div
                        key={cardIndex}
                        className={`${styles.card} ${
                          selectedCard === cardIndex ? styles.flipped : ""
                        } ${
                          selectedCard !== null && selectedCard !== cardIndex
                            ? styles.disabled
                            : ""
                        } ${
                          selectedCard === cardIndex
                            ? styles[getCardSize(revealedDare)]
                            : ""
                        } ${loadingDares ? styles.loading : ""}`}
                        onClick={() => handleCardClick(cardIndex)}
                      >
                        <div className={styles.cardInner}>
                          <div className={styles.cardFront}>
                            <span className={styles.cardNumber}>
                              {cardIndex + 1}
                            </span>
                          </div>
                          <div className={styles.cardBack}>
                            {selectedCard === cardIndex && revealedDare && (
                              <div className={styles.dareContent}>
                                <span className={styles.dareId}>
                                  Dare #{revealedDare.id}
                                </span>
                                <p className={styles.dareDescription}>
                                  {getTruncatedDescription(revealedDare.dare)}
                                </p>
                                <div className={styles.cardButtons}>
                                  {revealedDare.dare.length > 60 && (
                                    <button
                                      className={styles.viewMoreButton}
                                      onClick={handleViewMore}
                                    >
                                      <FaEye /> View More
                                    </button>
                                  )}
                                  <button
                                    style={{
                                      opacity: hasDareBeenChosen ? 0.5 : 1,
                                      pointerEvents: hasDareBeenChosen
                                        ? "none"
                                        : "auto",
                                    }}
                                    className={styles.chooseDareButton}
                                    onClick={(e) => {
                                      if (hasDareBeenChosen) return;
                                      setHasDareBeenChosen(true);
                                      e.stopPropagation();
                                      handleChooseDare();
                                    }}
                                    disabled={choosingDare}
                                  >
                                    {choosingDare ? (
                                      <>
                                        <FaSpinner
                                          className={styles.spinnerIcon}
                                        />{" "}
                                        Choosing...
                                      </>
                                    ) : (
                                      <>
                                        <FaCheck /> Choose Dare
                                      </>
                                    )}
                                  </button>
                                </div>
                                <span className={styles.darePoints}>
                                  {revealedDare.points} points
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.gameControls}>
                  {selectedCard !== null && !chosenDare && (
                    <button className={styles.resetButton} onClick={resetGame}>
                      Try Another Dare
                    </button>
                  )}
                  {chosenDare && (
                    <div className={styles.completedMessage}>
                      <p>
                        Dare selected! Your ID:{" "}
                        <strong
                          onClick={() => {
                            navigator.clipboard.writeText(chosenDare.id);
                            alert("Dare ID copied to clipboard!");
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {chosenDare.id}
                        </strong>
                      </p>
                      <button
                        className={styles.resetButton}
                        onClick={resetGame}
                      >
                        Start Over
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 VIBE CODING HACK+ATHON. All rights reserved.</p>
        <p>Organized by IEDC BOOTCAMP CEC & WE Cell</p>
      </footer>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        isLoading={modal.isLoading}
      />
    </div>
  );
}
