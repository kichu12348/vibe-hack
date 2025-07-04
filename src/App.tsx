import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import styles from "./App.module.css";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaGamepad,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaUsers,
  FaLaptopCode,
  FaCreditCard,
  FaUpload,
  FaQrcode,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronDown,
  FaWhatsapp,
  FaTrophy,
  FaBan,
} from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { FaRegHourglassHalf } from "react-icons/fa6";

const API_URL = import.meta.env.VITE_API_URL;
const UPI_ID = import.meta.env.VITE_UPI_ID;
const whatsAppUrl = import.meta.env.VITE_WHATSAPP_URL;

interface User {
  name: string;
  email: string;
  phone: string;
  gender: string;
}

interface FormData {
  college: string;
  teamName: string;
  teamSize: string;
  upiId: string;
  transactionId: string;
  paymentScreenshot: File | null;
  users: User[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "loading";
  showWhatsAppLink?: boolean;
  isLoading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  showWhatsAppLink = false,
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

  const handleWhatsAppClick = () => {
    window.open(whatsAppUrl, "_blank");
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
          {showWhatsAppLink && (
            <button
              className={styles.modalWhatsAppButton}
              onClick={handleWhatsAppClick}
            >
              <FaWhatsapp className={styles.modalWhatsAppIcon} />
              Join WhatsApp Group
            </button>
          )}
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

const Dropdown: React.FC<DropdownProps> = ({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        onClick={() => setIsOpen(!isOpen)}
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

function App() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(
    new Date() > new Date("2025-07-04T23:59:59")
  );
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error" | "warning" | "loading",
    showWhatsAppLink: false,
    isLoading: false,
  });
  const [formData, setFormData] = useState<FormData>({
    college: "",
    teamName: "",
    teamSize: "1",
    upiId: "",
    transactionId: "",
    paymentScreenshot: null,
    users: [{ name: "", email: "", phone: "", gender: "" }],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "teamSize") {
      const newTeamSize = parseInt(value);
      const newUsers = Array(newTeamSize)
        .fill(null)
        .map(
          (_, index) =>
            formData.users[index] || {
              name: "",
              email: "",
              phone: "",
              gender: "",
            }
        );

      setFormData({
        ...formData,
        [name]: value,
        users: newUsers,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleUserChange = (
    index: number,
    field: keyof User,
    value: string
  ) => {
    const newUsers = [...formData.users];
    newUsers[index] = { ...newUsers[index], [field]: value };
    setFormData({
      ...formData,
      users: newUsers,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      paymentScreenshot: file,
    });
  };

  const showModal = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "loading" = "success",
    showWhatsAppLink: boolean = false,
    isLoading: boolean = false
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      showWhatsAppLink,
      isLoading,
    });
  };

  const closeModal = () => {
    setModal({
      ...modal,
      isOpen: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const phoneNoSet = new Set<string>();
    const emailSet = new Set<string>();

    if (isRegistrationClosed) {
      showModal(
        "Registration Closed",
        "Registration deadline has passed on July 5th, 2025. We appreciate your interest!",
        "warning"
      );
      return;
    }

    // Validate that all user fields are filled
    for (let i = 0; i < formData.users.length; i++) {
      const user = formData.users[i];
      if (user.phone) {
        if (phoneNoSet.has(user.phone)) {
          showModal(
            "Duplicate Phone Number",
            `Phone number ${user.phone} is already used by another member.`,
            "warning"
          );
          return;
        }
        phoneNoSet.add(user.phone);
      }
      if (user.email) {
        if (emailSet.has(user.email)) {
          showModal(
            "Duplicate Email",
            `Email ${user.email} is already used by another member.`,
            "warning"
          );
          return;
        }
        emailSet.add(user.email);
      }
      if (!user.name || !user.email || !user.phone || !user.gender) {
        showModal(
          "Incomplete Information",
          `Please fill all fields for member ${i + 1}`,
          "warning"
        );
        return;
      }
    }

    // Validate that either transaction ID or payment screenshot is provided
    if (!formData.transactionId && !formData.paymentScreenshot) {
      showModal(
        "Payment Required",
        "Please provide either transaction ID or payment screenshot",
        "warning"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      showModal(
        "Processing Registration...",
        "Your registration is being processed. While you wait, join our WhatsApp group for updates and connect with other participants!",
        "loading",
        true,
        true
      );
      const apiFormData = new FormData();
      apiFormData.append("college", formData.college);
      apiFormData.append("teamName", formData.teamName);
      apiFormData.append("teamSize", formData.teamSize);
      apiFormData.append("upiId", formData.upiId);
      apiFormData.append("transactionId", formData.transactionId);

      // Add user data
      formData.users.forEach((user, index) => {
        apiFormData.append(`users[${index}][name]`, user.name);
        apiFormData.append(`users[${index}][email]`, user.email);
        apiFormData.append(`users[${index}][phone]`, user.phone);
        apiFormData.append(`users[${index}][gender]`, user.gender);
      });

      // Only append screenshot if it exists
      if (formData.paymentScreenshot) {
        apiFormData.append("paymentScreenshot", formData.paymentScreenshot);
      }

      // Submit to backend API
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        body: apiFormData,
      });

      const result = await response.json();

      if (response.ok) {
        showModal(
          "Registration Successful!",
          "Your registration has been submitted successfully. Your payment will be verified soon. Join our WhatsApp group for updates and announcements!",
          "success",
          true
        );
        setShowRegistration(false);
        // Reset form
        setFormData({
          college: "",
          teamName: "",
          teamSize: "1",
          upiId: "",
          transactionId: "",
          paymentScreenshot: null,
          users: [{ name: "", email: "", phone: "", gender: "" }],
        });
      } else {
        showModal(
          "Registration Failed",
          result.error || "Registration failed. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      showModal(
        "Network Error",
        "Please check your connection and try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const teamSizeOptions: DropdownOption[] = [
    { value: "1", label: "1 (Individual)" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
  ];

  const genderOptions: DropdownOption[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  const handleDropdownChange = (value: string) => {
    const event = {
      target: {
        name: "teamSize",
        value: value,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(event);
  };

  const handleGenderChange = (index: number, value: string) => {
    handleUserChange(index, "gender", value);
  };

  // Check if registration is closed
  useEffect(() => {
    const checkRegistrationDeadline = () => {
      const now = new Date();
      const deadline = new Date("2025-07-04T23:59:59"); // July 4th, 2025 at 11:59:59 PM

      if (now > deadline) {
        setIsRegistrationClosed(true);
        setShowRegistration(false);
      }
    };

    checkRegistrationDeadline();
    // Check every minute to ensure real-time updates
    const interval = setInterval(checkRegistrationDeadline, 60000);

    return () => clearInterval(interval);
  }, []);

  const handlePlayButtonClick = () => {
    if (isRegistrationClosed) {
      showModal(
        "Registration Closed",
        "Registration deadline has passed on July 5th, 2025. We appreciate your interest!",
        "warning"
      );
      return;
    }
    setShowRegistration(true);
  };

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
          READY FOR A
          <br />
          VIBE CODING <span className={styles.highlight}>CHALLENGE?</span>
        </h1>
      </header>

      <main>
        <div className={styles.gameScreen}>
          <div className={styles.gameContent}>
            <h2 className={styles.subtitle}>
              <span className={styles.highlight}>VIBE CODING</span>
              <br />
              HACK+ ATHON
            </h2>

            <div className={styles.hackathonInfo}>
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>
                  <FaCalendarAlt /> DATE
                </h3>
                <p className={styles.infoValue}>05-06 JULY</p>
              </div>

              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>
                  <FaClock /> STARTING TIME
                </h3>
                <p className={styles.infoValue}>09:00 AM</p>
              </div>

              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>
                  <FaTrophy /> PRIZE POOL
                </h3>
                <p className={styles.infoValue}>₹1,500</p>
              </div>
            </div>

            <p className={styles.fee}>
              <FaRupeeSign /> REGISTRATION FEE: 150 RS
            </p>

            {isRegistrationClosed ? (
              <div className={styles.registrationClosed}>
                <h3 className={styles.registrationClosedTitle}>
                  <FaBan /> REGISTRATION CLOSED
                </h3>
                <p className={styles.registrationClosedMessage}>
                  Registration deadline has passed on July 5th, 2025.
                  <br />
                  Thank you for your interest in the VIBE CODING HACK+ATHON!
                </p>
              </div>
            ) : (
              <>
                {!showRegistration && (
                  <div className={styles.deadlineNotice}>
                    <p className={styles.deadlineText}>
                      <CiWarning size={28} /> Registration closes on July 4th,
                      2025 at 11:59 PM
                    </p>
                  </div>
                )}

                {!showRegistration ? (
                  <button
                    className={styles.playButton}
                    onClick={handlePlayButtonClick}
                  >
                    <FaGamepad /> PLAY
                  </button>
                ) : (
                  <div className={styles.formContainer}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                      <div className={styles.formGroup}>
                        <label htmlFor="college" className={styles.label}>
                          <FaLaptopCode /> College/Institution
                        </label>
                        <input
                          type="text"
                          id="college"
                          name="college"
                          value={formData.college}
                          onChange={handleInputChange}
                          required
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="teamName" className={styles.label}>
                          <FaUsers /> Team Name
                        </label>
                        <input
                          type="text"
                          id="teamName"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleInputChange}
                          required
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="teamSize" className={styles.label}>
                          <FaUsers /> Team Size
                        </label>
                        <Dropdown
                          value={formData.teamSize}
                          options={teamSizeOptions}
                          onChange={handleDropdownChange}
                          placeholder="Select team size"
                          className={styles.input}
                        />
                      </div>

                      {/* Team Members Section */}
                      <div className={styles.teamMembersSection}>
                        <h3 className={styles.sectionTitle}>
                          <FaUsers /> Team Members
                        </h3>
                        {formData.users.map((user, index) => (
                          <div key={index} className={styles.userGroup}>
                            <h4 className={styles.userTitle}>
                              <FaUser /> Member {index + 1}
                            </h4>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>
                                <FaUser /> Full Name
                              </label>
                              <input
                                type="text"
                                value={user.name}
                                onChange={(e) =>
                                  handleUserChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                required
                                className={styles.input}
                                placeholder={`name`}
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>
                                <FaEnvelope /> Email*
                              </label>
                              <input
                                type="email"
                                value={user.email}
                                onChange={(e) =>
                                  handleUserChange(
                                    index,
                                    "email",
                                    e.target.value
                                  )
                                }
                                required
                                className={styles.input}
                                placeholder={`email`}
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>
                                <FaPhone /> Phone Number*
                              </label>
                              <input
                                type="tel"
                                value={user.phone}
                                onChange={(e) =>
                                  handleUserChange(
                                    index,
                                    "phone",
                                    e.target.value
                                  )
                                }
                                required
                                className={styles.input}
                                placeholder={`+91-`}
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>
                                <FaUser /> Gender*
                              </label>
                              <Dropdown
                                value={user.gender}
                                options={genderOptions}
                                onChange={(value) =>
                                  handleGenderChange(index, value)
                                }
                                placeholder="Select gender"
                                className={styles.input}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Payment Section */}
                      <div className={styles.paymentSection}>
                        <h3 className={styles.sectionTitle}>
                          <FaQrcode /> Payment Details
                        </h3>
                        <p className={styles.paymentInstructions}>
                          Pay ₹150 via UPI and provide either transaction ID or
                          upload payment screenshot
                        </p>

                        <div className={styles.upiDetails}>
                          <p>
                            <strong>CLICK TO COPY UPI ID:</strong>{" "}
                            <a
                              onClick={() =>
                                navigator.clipboard.writeText(UPI_ID)
                              }
                              className={styles.upiId}
                            >
                              {UPI_ID}
                            </a>
                          </p>
                          <p>
                            <strong>Amount:</strong> ₹150
                          </p>
                          <div className={styles.qrContainer}>
                            <p>
                              <strong>Scan to Pay:</strong>
                            </p>
                            <img
                              src="/qr/qr.jpeg"
                              alt="UPI Payment QR Code"
                              className={styles.qrCode}
                            />
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="upiId" className={styles.label}>
                            <FaCreditCard /> Your UPI ID (used for payment)
                          </label>
                          <input
                            type="text"
                            id="upiId"
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleInputChange}
                            placeholder="yourname@oksbi"
                            required
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label
                            htmlFor="transactionId"
                            className={styles.label}
                          >
                            <FaCreditCard /> Transaction ID
                          </label>
                          <input
                            type="text"
                            id="transactionId"
                            name="transactionId"
                            value={formData.transactionId}
                            onChange={handleInputChange}
                            placeholder="Enter transaction ID from payment"
                            className={styles.input}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label
                            htmlFor="paymentScreenshot"
                            className={styles.label}
                          >
                            <FaUpload /> Payment Screenshot
                          </label>
                          <input
                            type="file"
                            id="paymentScreenshot"
                            name="paymentScreenshot"
                            onChange={handleFileChange}
                            accept="image/*"
                            className={styles.fileInput}
                          />
                          {formData.paymentScreenshot && (
                            <p className={styles.fileName}>
                              Selected: {formData.paymentScreenshot.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "REGISTERING..." : "REGISTER NOW"}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}

            <p className={styles.venue}>
              <FaMapMarkerAlt /> VENUE: ONLINE PLATFORM
            </p>
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
        showWhatsAppLink={modal.showWhatsAppLink}
        isLoading={modal.isLoading}
      />
    </div>
  );
}

export default App;
