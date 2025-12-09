// src/pages/TravellerDetails/TravellerDetails.jsx
import React, { useReducer, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TravellerDetails.module.css";
import FareSummary from "../../components/faresummary/fareSummary";
import HandleSubmitTraveller from "../../API/Submittraveller";
import paymentFunction from "../../services/paymentFunction";

// YOUR modal (you already created it)
import LoginRequiredModal from "../../components/common/LoginRequiredModal";

const EmptyData = {
  firstName: "",
  lastName: "",
  gender: "Male",
  countryCode: "+91",
  mobileNumber: "",
  email: "",
  gstNumber: "",
  state: "Delhi",
  wheelchair: false,
  hasGst: false,
  saveToTravellerList: false,
};

const Reducer = (state, action) => ({ ...state, [action.type]: action.val });

const countryCodes = ["+91", "+1", "+44", "+61", "+971"];
const states = [
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "West Bengal",
  "Gujarat",
  "Rajasthan",
  "Telangana",
];

const TravellerDetails = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fareSelection, tripType, originalFlights } = location.state || {};
  const flight = { fareSelection, tripType, originalFlights };

  // 🔥 Modal opens ONLY when user clicks "Proceed to Payment"
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [state, dispatch] = useReducer(Reducer, EmptyData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  // ---------------- VALIDATION ----------------
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) return "This field is required.";
        if (!/^[a-zA-Z\\s'.-]{2,}$/.test(value)) return "Use 2+ letters only.";
        return "";
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(value))
          return "Enter a valid email.";
        return "";
      case "mobileNumber":
        if (!value.trim()) return "Mobile number is required.";
        if (!/^\\d{10}$/.test(value)) return "Use 10 digits";
        return "";
      case "gstNumber":
        if (!value.trim()) return "GST number is required.";
        if (!/^[0-9A-Z]{15}$/.test(value))
          return "Enter a valid 15-char GSTIN.";
        return "";
      default:
        return "";
    }
  };

  const validateAll = () => {
    const fields = ["firstName", "lastName", "email", "mobileNumber"];
    if (state.hasGst) fields.push("gstNumber");

    const newErrors = {};
    fields.forEach((f) => {
      newErrors[f] = validateField(f, state[f]);
    });

    setErrors(newErrors);

    const newTouched = {};
    fields.forEach((f) => (newTouched[f] = true));
    setTouched(newTouched);

    return Object.values(newErrors).every((e) => e === "");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let val = value;
    if (name === "mobileNumber") val = value.replace(/\D/g, "");
    if (name === "gstNumber") val = value.toUpperCase();

    dispatch({ type: name, val });
    setErrors({ ...errors, [name]: validateField(name, val) });
  };

  // ---------------- SUBMIT ----------------
  const HandleSubmit = async (e) => {
    e.preventDefault();

    // ❗ FIRST check if user is logged in
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // then validate form
    const isValid = validateAll();
    if (!isValid) return;

    setLoading(true);
    try {
      const BookingData = await HandleSubmitTraveller(state, flight);
      await paymentFunction(BookingData, navigate);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while processing payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔥 Modal appears ONLY when user clicks "Proceed to Payment" */}
      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <div className={styles.page}>
        <div className={styles.notice}>
          Offers can be applied after login.{" "}
          <button
            className={styles.loginLink}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        <div className={styles.layout}>
          {/* Left Column */}
          <main className={styles.left}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.title}>Traveller details</h2>
                <span className={styles.pill}>Adult 1</span>
              </div>

              <form
                onSubmit={HandleSubmit}
                noValidate
                className={styles.travellerInput}
              >
                {/* ===== All form inputs remain unchanged ===== */}

                <fieldset className={styles.grid3}>
                  <div className={styles.field}>
                    <label htmlFor="firstName">First & Middle Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={state.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    {touched.firstName && errors.firstName && (
                      <p className={styles.error}>{errors.firstName}</p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={state.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    {touched.lastName && errors.lastName && (
                      <p className={styles.error}>{errors.lastName}</p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <span>Gender</span>
                    <div className={styles.radioGroup}>
                      {["Male", "Female", "Other"].map((g) => (
                        <label key={g}>
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={state.gender === g}
                            onChange={(e) =>
                              dispatch({
                                type: "gender",
                                val: e.target.value,
                              })
                            }
                          />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Country Code</label>
                    <select
                      value={state.countryCode}
                      onChange={(e) =>
                        dispatch({
                          type: "countryCode",
                          val: e.target.value,
                        })
                      }
                    >
                      {countryCodes.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label>Mobile No</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={state.mobileNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    {touched.mobileNumber && errors.mobileNumber && (
                      <p className={styles.error}>{errors.mobileNumber}</p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={state.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    />
                    {touched.email && errors.email && (
                      <p className={styles.error}>{errors.email}</p>
                    )}
                  </div>
                </fieldset>

                {/* Divider */}
                <div className={styles.hr}></div>

                {/* ===== Booking Contact ===== */}
                <fieldset className={styles.grid3}>
                  <legend>Booking details will be sent to</legend>

                  <div className={styles.field}>
                    <select
                      value={state.countryCode}
                      onChange={(e) =>
                        dispatch({
                          type: "countryCode",
                          val: e.target.value,
                        })
                      }
                    >
                      {countryCodes.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={state.mobileNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.field}>
                    <input
                      type="email"
                      name="email"
                      value={state.email}
                      onChange={handleChange}
                    />
                  </div>
                </fieldset>

                <div className={styles.hr}></div>

                {/* ===== GST Section ===== */}
                <fieldset className={styles.grid3}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={state.hasGst}
                      onChange={(e) =>
                        dispatch({
                          type: "hasGst",
                          val: e.target.checked,
                        })
                      }
                    />
                    <span>I have a GST number (optional)</span>
                  </label>

                  {state.hasGst && (
                    <div className={styles.field}>
                      <label>GST Number</label>
                      <input
                        type="text"
                        name="gstNumber"
                        value={state.gstNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.gstNumber && errors.gstNumber && (
                        <p className={styles.error}>{errors.gstNumber}</p>
                      )}
                    </div>
                  )}
                </fieldset>

                {/* Divider */}
                <div className={styles.hr}></div>

                {/* ===== State & Save Traveller ===== */}
                <fieldset className={styles.grid3}>
                  <div className={styles.field}>
                    <label>Your State</label>
                    <select
                      value={state.state}
                      onChange={(e) =>
                        dispatch({
                          type: "state",
                          val: e.target.value,
                        })
                      }
                    >
                      {states.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={state.saveToTravellerList}
                      onChange={(e) =>
                        dispatch({
                          type: "saveToTravellerList",
                          val: e.target.checked,
                        })
                      }
                    />
                    <span>Add to My Traveller List</span>
                  </label>
                </fieldset>

                {/* ===== Submit Button ===== */}
                <div className={styles.actions}>
                  <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? (
                      <>
                        <span className={styles.spinner}></span>
                        Processing Payment...
                      </>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </button>
                </div>
              </form>
            </section>
          </main>

          {/* Right column */}
          <aside className={styles.right}>
            <div className={styles.sticky}>
              <FareSummary flight={flight} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default TravellerDetails;
