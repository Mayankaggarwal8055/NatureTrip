import React, { useReducer, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TravellerDetails.module.css";
import FareSummary from "../../components/faresummary/fareSummary";
import HandleSubmitTraveller from "../../API/Submittraveller";
import paymentFunction from "../../services/paymentFunction";

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

const TravellerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fareSelection, tripType, originalFlights } = location.state || {};
  const flight = { fareSelection, tripType, originalFlights };

  const [state, dispatch] = useReducer(Reducer, EmptyData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false); // ✅ loader state

  // Validation logic
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) return "This field is required.";
        if (!/^[a-zA-Z\\s'.-]{2,}$/.test(value)) return "Use 2+ letters only.";
        return "";
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
          return "Enter a valid email.";
        return "";
      case "mobileNumber":
        if (!value.trim()) return "Mobile number is required.";
        if (!/^\d{10}$/.test(value)) return "Use 10 digits";
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

  // Validation on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    const msg = validateField(name, value);
    setErrors((er) => ({ ...er, [name]: msg }));
  };

  // Form submit handler
  const HandleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // ✅ show loader
    try {
      const BookingData = await HandleSubmitTraveller(state, flight);
      await paymentFunction(BookingData, navigate);
    } catch (err) {
      console.error("Error while submitting traveller:", err);
      alert("Something went wrong while processing payment. Please try again.");
    } finally {
      setLoading(false); // ✅ hide loader if paymentFunction fails
    }
  };

  const handleLogin = () => navigate("/login");

  return (
    <div className={styles.page}>
      {/* Login Notice */}
      <div className={styles.notice}>
        Offers can be applied after login.{" "}
        <button className={styles.loginLink} onClick={handleLogin}>
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

            {/* Form */}
            <form
              onSubmit={HandleSubmit}
              noValidate
              className={styles.travellerInput}
            >
              {/* ===== Traveller Info ===== */}
              <fieldset className={styles.grid3}>
                <div className={styles.field}>
                  <label htmlFor="firstName">First & Middle Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={state.firstName}
                    onChange={(e) =>
                      dispatch({ type: "firstName", val: e.target.value })
                    }
                    onBlur={handleBlur}
                    aria-invalid={!!errors.firstName && touched.firstName}
                    aria-describedby="firstName-error"
                    required
                  />
                  {touched.firstName && errors.firstName && (
                    <p id="firstName-error" className={styles.error}>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={state.lastName}
                    onChange={(e) =>
                      dispatch({ type: "lastName", val: e.target.value })
                    }
                    onBlur={handleBlur}
                    aria-invalid={!!errors.lastName && touched.lastName}
                    aria-describedby="lastName-error"
                    required
                  />
                  {touched.lastName && errors.lastName && (
                    <p id="lastName-error" className={styles.error}>
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Gender</span>
                  <div
                    className={styles.radioGroup}
                    role="radiogroup"
                    aria-label="Gender"
                  >
                    {["Male", "Female", "Other"].map((g) => (
                      <label key={g} className={styles.radio}>
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={state.gender === g}
                          onChange={(e) =>
                            dispatch({ type: "gender", val: e.target.value })
                          }
                        />
                        <span>{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="countryCode">Country Code</label>
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={state.countryCode}
                    onChange={(e) =>
                      dispatch({ type: "countryCode", val: e.target.value })
                    }
                  >
                    {countryCodes.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="mobileNumber">Mobile No</label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={state.mobileNumber}
                    onChange={(e) =>
                      dispatch({
                        type: "mobileNumber",
                        val: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    onBlur={handleBlur}
                    aria-invalid={!!errors.mobileNumber && touched.mobileNumber}
                    aria-describedby="mobileNumber-error"
                    required
                  />
                  {touched.mobileNumber && errors.mobileNumber && (
                    <p id="mobileNumber-error" className={styles.error}>
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={state.email}
                    onChange={(e) =>
                      dispatch({ type: "email", val: e.target.value })
                    }
                    onBlur={handleBlur}
                    aria-invalid={!!errors.email && touched.email}
                    aria-describedby="email-error"
                    required
                  />
                  {touched.email && errors.email && (
                    <p id="email-error" className={styles.error}>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className={styles.rowFull}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={state.wheelchair}
                      onChange={(e) =>
                        dispatch({
                          type: "wheelchair",
                          val: e.target.checked,
                        })
                      }
                    />
                    <span>I require wheelchair (optional)</span>
                  </label>
                </div>
              </fieldset>

              <div className={styles.hr}></div>

              {/* ===== Booking Contact ===== */}
              <fieldset className={styles.grid3}>
                <legend className={styles.legend}>
                  Booking details will be sent to
                </legend>
                <div className={styles.field}>
                  <label htmlFor="sendCountryCode">Country Code</label>
                  <select
                    id="sendCountryCode"
                    value={state.countryCode}
                    onChange={(e) =>
                      dispatch({ type: "countryCode", val: e.target.value })
                    }
                  >
                    {countryCodes.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label htmlFor="sendMobileNumber">Mobile No</label>
                  <input
                    type="tel"
                    id="sendMobileNumber"
                    value={state.mobileNumber}
                    onChange={(e) =>
                      dispatch({
                        type: "mobileNumber",
                        val: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="sendEmail">Email</label>
                  <input
                    type="email"
                    id="sendEmail"
                    value={state.email}
                    onChange={(e) =>
                      dispatch({ type: "email", val: e.target.value })
                    }
                  />
                </div>
              </fieldset>

              <div className={styles.hr}></div>

              {/* ===== GST Section ===== */}
              <fieldset className={styles.grid3}>
                <div className={styles.rowFull}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={state.hasGst}
                      onChange={(e) =>
                        dispatch({ type: "hasGst", val: e.target.checked })
                      }
                    />
                    <span>I have a GST number (optional)</span>
                  </label>
                </div>

                {state.hasGst && (
                  <div className={styles.field}>
                    <label htmlFor="gstNumber">GST Number</label>
                    <input
                      type="text"
                      id="gstNumber"
                      name="gstNumber"
                      value={state.gstNumber}
                      onChange={(e) =>
                        dispatch({
                          type: "gstNumber",
                          val: e.target.value.toUpperCase(),
                        })
                      }
                      onBlur={handleBlur}
                      aria-invalid={!!errors.gstNumber && touched.gstNumber}
                      aria-describedby="gstNumber-error"
                    />
                    {touched.gstNumber && errors.gstNumber && (
                      <p id="gstNumber-error" className={styles.error}>
                        {errors.gstNumber}
                      </p>
                    )}
                  </div>
                )}
              </fieldset>

              <div className={styles.hr}></div>

              {/* ===== State & Save Traveller ===== */}
              <fieldset className={styles.grid3}>
                <div className={styles.field}>
                  <label htmlFor="state">Your State</label>
                  <select
                    id="state"
                    value={state.state}
                    onChange={(e) =>
                      dispatch({ type: "state", val: e.target.value })
                    }
                  >
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.rowFull}>
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
                    <span>Add these travellers to My Traveller List</span>
                  </label>
                </div>
              </fieldset>

              {/* ===== Submit Button ===== */}
              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
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

        {/* Right Column - Fare Summary */}
        <aside className={styles.right}>
          <div className={styles.sticky}>
            <FareSummary flight={flight} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TravellerDetails;
