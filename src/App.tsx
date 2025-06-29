import React, { useState } from "react";
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
} from "react-icons/fa";

interface FormData {
  name: string;
  email: string;
  phone: string;
  college: string;
  teamName: string;
  teamSize: string;
}

function App() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    college: "",
    teamName: "",
    teamSize: "1",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log("Form submitted:", formData);
    alert("Registration successful! We will contact you soon.");
    setShowRegistration(false);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      college: "",
      teamName: "",
      teamSize: "1",
    });
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
            </div>

            <p className={styles.fee}>
              <FaRupeeSign /> REGISTRATION FEE: 150 RS
            </p>

            {!showRegistration ? (
              <button
                className={styles.playButton}
                onClick={() => setShowRegistration(true)}
              >
                <FaGamepad /> PLAY
              </button>
            ) : (
              <div className={styles.formContainer}>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                      <FaUser /> Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      <FaEnvelope /> Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      <FaPhone /> Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
                    />
                  </div>

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
                    <select
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
                    >
                      <option value="1">1 (Individual)</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    REGISTER NOW
                  </button>
                </form>
              </div>
            )}

            <p className={styles.venue}>
              <FaMapMarkerAlt /> VENUE: ONLINE PLATFORM
            </p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 VIBE CODING HACK+ATHON. All rights reserved.</p>
        <p>Organized by IEDC CEC & WE Cell</p>
      </footer>
    </div>
  );
}

export default App;
