import React, { useState, useEffect, useRef } from "react";
import styles from "./project.module.css";
import appStyles from "../App.module.css";
import {
  FaProjectDiagram,
  FaUsers,
  FaFileAlt,
  FaLink,
  FaUpload,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronDown,
  FaCalendarAlt,
  FaClock,
  FaBan,
} from "react-icons/fa";
import { FaRegHourglassHalf } from "react-icons/fa6";
import { CiWarning } from "react-icons/ci";

const API_URL = import.meta.env.VITE_API_URL;

interface AllTeamsApiResponse {
  id: number;
  team_name: string;
}

interface ProjectFormData {
  registrationId: number;
  projectTitle: string;
  projectDescription: string;
  projectUrl: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "loading";
  isLoading?: boolean;
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

const checkSubmissionDeadline = (): boolean => {
  const date = new Date();
  const now = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const deadline = new Date("2025-07-06T22:00:00"); // July 6th, 2025 at 10:00 PM IST
  return now > deadline;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  isLoading = false,
}) => {
  if (!isOpen) return null;

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
          <p className={styles.modalMessage}>{message}</p>
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
async function fetchAllTeams(): Promise<AllTeamsApiResponse[] | void> {
  const response = await fetch(`${API_URL}/get-all-teams`);
  if (!response.ok) {
    throw new Error("Failed to fetch teams");
  }
  const { teams } = await response.json();
  return teams;
}

async function submitProject(data: ProjectFormData): Promise<void> {
  const response = await fetch(`${API_URL}/submit-project`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit project");
  }
}

const showDeadlineNotice = () => {
  const deadlineStart = new Date("2025-07-06T00:00:00"); // July 6th, 2025 at 12:00 AM IST
  const date = new Date();
  const now = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const nowDate = new Date(now);
  return nowDate > deadlineStart;
};

const SHOW_DEADLINE_NOTICE = showDeadlineNotice();

interface BubbleInputProps {
  urls: string[];
  onUrlsChange: (urls: string[]) => void;
  placeholder?: string;
  className?: string;
}

const BubbleInput: React.FC<BubbleInputProps> = ({
  urls,
  onUrlsChange,
  placeholder = "Enter URLs...",
  className = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.trim());
      return true;
    } catch {
      return false;
    }
  };

  const addUrl = (url: string) => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    if (!isValidUrl(trimmedUrl)) {
      setError(`"${trimmedUrl}" is not a valid URL`);
      return;
    }

    if (urls.includes(trimmedUrl)) return;

    setError("");
    onUrlsChange([...urls, trimmedUrl]);
    setInputValue("");
  };

  const removeUrl = (urlToRemove: string) => {
    onUrlsChange(urls.filter((url) => url !== urlToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setError("");

    // Auto-detect URLs when user types space, comma, or enters
    const separators = /[\s,]+/;
    if (separators.test(value)) {
      const parts = value.split(separators);
      const urlPart = parts[0].trim();
      const remaining = parts.slice(1).join(" ").trim();

      if (urlPart) {
        addUrl(urlPart);
      }
      setInputValue(remaining);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        addUrl(inputValue.trim());
      }
    } else if (e.key === "Backspace" && !inputValue && urls.length > 0) {
      // Remove last URL when backspace is pressed on empty input
      removeUrl(urls[urls.length - 1]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const urlsFromPaste = pastedText
      .split(/[\s,\n\r]+/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    urlsFromPaste.forEach((url) => {
      if (!urls.includes(url)) {
        addUrl(url);
      }
    });
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={`${styles.bubbleContainer} ${className}`}>
      <div className={styles.bubbleInputWrapper} onClick={handleContainerClick}>
        {urls.map((url, index) => (
          <div key={index} className={styles.urlBubble}>
            <span className={styles.urlBubbleText} title={url}>
              {url}
            </span>
            <button
              type="button"
              className={styles.urlBubbleRemove}
              onClick={(e) => {
                e.stopPropagation();
                removeUrl(url);
              }}
              aria-label={`Remove ${url}`}
            >
              <FaTimes />
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={urls.length === 0 ? placeholder : ""}
          className={styles.bubbleInput}
        />
      </div>
      {error && <p className={styles.bubbleError}>{error}</p>}
      <p className={styles.bubbleHelp}>
        Type or paste URLs and press Enter, Space, or Comma to add them. Press
        Backspace to remove the last URL.(Videos, GitHub repos, Drive links, ppt files, hosted urls.)
      </p>
    </div>
  );
};

function Projects() {
  const [teams, setTeams] = useState<AllTeamsApiResponse[]>([]);
  const [isSubmissionClosed, setIsSubmissionClosed] = useState(
    checkSubmissionDeadline()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectUrls, setProjectUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>({
    registrationId: 0,
    projectTitle: "",
    projectDescription: "",
    projectUrl: "",
  });
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
        console.error("Error loading teams:", error);
        showModal(
          "Error",
          "Failed to load teams. Please refresh the page.",
          "error"
        );
      }
    };

    loadTeams();
  }, []);

  useEffect(() => {
    const checkDeadline = () => {
      const isClosed = checkSubmissionDeadline();
      if (isClosed) {
        setIsSubmissionClosed(true);
      }
    };

    checkDeadline();
    const interval = setInterval(checkDeadline, 60000);

    return () => clearInterval(interval);
  }, []);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTeamSelect = (value: string) => {
    setFormData({
      ...formData,
      registrationId: parseInt(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (isSubmissionClosed) {
      showModal(
        "Submission Closed",
        "Project submission deadline has passed on July 6th, 2025 at 9:00 PM.",
        "warning"
      );
      return;
    }

    // Validate form
    if (!formData.registrationId) {
      showModal("Team Required", "Please select your team.", "warning");
      return;
    }

    if (!formData.projectTitle.trim()) {
      showModal("Title Required", "Please enter a project title.", "warning");
      return;
    }

    if (!formData.projectDescription.trim()) {
      showModal(
        "Description Required",
        "Please enter a project description.",
        "warning"
      );
      return;
    }

    if (projectUrls.length === 0) {
      showModal("URL Required", "Please add at least one project URL.", "warning");
      return;
    }

    try {
      setIsSubmitting(true);
      showModal(
        "Submitting Project...",
        "Your project is being submitted. Please wait...",
        "loading",
        true
      );

      // Convert URLs array to comma-separated string
      const processedFormData = {
        ...formData,
        projectUrl: projectUrls.join(","),
      };

      await submitProject(processedFormData);

      showModal(
        "Project Submitted Successfully!",
        "Your project has been submitted successfully. Good luck with the hackathon!",
        "success"
      );

      // Reset form
      setFormData({
        registrationId: 0,
        projectTitle: "",
        projectDescription: "",
        projectUrl: "",
      });
      setProjectUrls([]);
    } catch (error) {
      console.error("Submission error:", error);
      showModal(
        "Submission Failed",
        "Failed to submit project. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const teamOptions: DropdownOption[] = teams.map((team) => ({
    value: team.id.toString(),
    label: team.team_name,
  }));

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
          PROJECT
          <br />
          <span className={styles.highlight}>SUBMISSION</span>
        </h1>
      </header>

      <main>
        <div className={styles.gameScreen}>
          <div className={styles.gameContent}>
            <h2 className={styles.subtitle}>
              <span className={styles.highlight}>VIBE CODING</span>
              <br />
              PROJECT SUBMISSION
            </h2>

            <div className={styles.hackathonInfo}>
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>
                  <FaCalendarAlt /> SUBMISSION DEADLINE
                </h3>
                <p className={styles.infoValue}>06 JULY</p>
              </div>

              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>
                  <FaClock /> DEADLINE TIME
                </h3>
                <p className={styles.infoValue}>10:00 PM</p>
              </div>
            </div>

            {isSubmissionClosed ? (
              <div className={styles.submissionClosed}>
                <h3 className={styles.submissionClosedTitle}>
                  <FaBan /> SUBMISSION CLOSED
                </h3>
                <p className={styles.submissionClosedMessage}>
                  Project submission deadline has passed on July 6th, 2025 at
                  10:00 PM.
                  <br />
                  Thank you for participating in the VIBE CODING HACK+ATHON!
                </p>
              </div>
            ) : (
              <>
                {SHOW_DEADLINE_NOTICE && (
                  <div className={styles.deadlineNotice}>
                    <p className={styles.deadlineText}>
                      <CiWarning size={28} /> Project submission closes on July
                      6th, 2025 at 10:00 PM
                    </p>
                  </div>
                )}

                <div className={styles.formContainer}>
                  <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                      <label htmlFor="team" className={styles.label}>
                        <FaUsers /> Select Your Team
                      </label>
                      <Dropdown
                        value={formData.registrationId.toString()}
                        options={teamOptions}
                        onChange={handleTeamSelect}
                        placeholder="Select your team"
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="projectTitle" className={styles.label}>
                        <FaProjectDiagram /> Project Title
                      </label>
                      <input
                        type="text"
                        id="projectTitle"
                        name="projectTitle"
                        value={formData.projectTitle}
                        onChange={handleInputChange}
                        required
                        className={styles.input}
                        placeholder="project title"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label
                        htmlFor="projectDescription"
                        className={styles.label}
                      >
                        <FaFileAlt /> Project Description
                      </label>
                      <textarea
                        id="projectDescription"
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleInputChange}
                        required
                        className={styles.textarea}
                        placeholder="Describe your project, its features, and technologies used..."
                        rows={6}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="projectUrl" className={styles.label}>
                        <FaLink /> Project URLs
                      </label>
                      <BubbleInput
                        urls={projectUrls}
                        onUrlsChange={setProjectUrls}
                        placeholder="https://github.com/yourusername/project"
                        className={styles.input}
                      />
                    </div>

                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FaRegHourglassHalf /> SUBMITTING...
                        </>
                      ) : (
                        <>
                          <FaUpload /> SUBMIT PROJECT
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </>
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

export default Projects;
