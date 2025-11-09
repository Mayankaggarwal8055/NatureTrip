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

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) return "This field is required.";
        if (!/^[a-zA-Z\s'.-]{2,}$/.test(value)) return "Use 2+ letters only.";
        return "";
      case "email":
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
          return "Enter a valid email.";
        return "";
      case "mobileNumber":
        if (!value.trim()) return "Mobile number is required.";
        if (!/^\d{7,15}$/.test(value)) return "Use 7–15 digits.";
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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    const msg = validateField(name, value);
    setErrors((er) => ({ ...er, [name]: msg }));
  };

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
      setLoading(false); // ✅ re-enable once payment page loads or fails
    }
  };

  const handleLogin = () => navigate("/login");

  return (
    <div className={styles.page}>
      {/* Notice */}
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
            <form onSubmit={HandleSubmit} noValidate className={styles.travellerInput}>
              {/* --- All traveller input fields stay the same --- */}

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading} // ✅ disable while loading
                >
                  {loading ? (
                    <>
                      <span className={styles.spinner}></span> Processing Payment...
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
