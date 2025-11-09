import { Fragment, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./bookingcard.module.css";
import handleCheapFlight from "../../API/Cheapflights";

const Bookingcard = () => {
  const [tripType, setTripType] = useState("oneWay");
  const [showReturnPicker, setShowReturnPicker] = useState(false);
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputFrom = useRef();
  const inputTo = useRef();
  const inputDeparture = useRef();
  const inputReturn = useRef();
  const navigate = useNavigate();

  // Date limits
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

  const maxDateObj = new Date();
  maxDateObj.setDate(today.getDate() + 30);
  const maxY = maxDateObj.getFullYear();
  const maxM = String(maxDateObj.getMonth() + 1).padStart(2, "0");
  const maxD = String(maxDateObj.getDate()).padStart(2, "0");
  const maxDate = `${maxY}-${maxM}-${maxD}`;

  useEffect(() => {
    if (tripType === "roundTrip" && showReturnPicker && inputReturn.current) {
      inputReturn.current.focus();
    }
  }, [tripType, showReturnPicker]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (tripType === "roundTrip") {
      if (!inputReturn.current.value) {
        setError("Please select a return date");
        setLoading(false);
        return;
      }
      if (inputReturn.current.value <= inputDeparture.current.value) {
        setError("Return date must be after departure date");
        setLoading(false);
        return;
      }
    } else {
      if (inputReturn.current) inputReturn.current.value = "";
    }

    const flightData = {
      from: inputFrom.current.value.trim(),
      to: inputTo.current.value.trim(),
      departure: inputDeparture.current.value,
      tripType,
      ...(tripType === "roundTrip" && { return: inputReturn.current.value }),
    };

    try {
      const userInputData = await handleCheapFlight(flightData);

      if (userInputData?.error) {
        setError(userInputData.error);
        setLoading(false);
        return;
      }

      if (userInputData) {
        // small delay to show loader before route change
        setTimeout(() => {
          navigate("/results", { state: userInputData });
        }, 400);
      }
    } catch (err) {
      console.error("Error submitting flight data:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className={styles.bookingContainer}>
        <h1 className={styles.bookingTitle}>Book Your Cheap Flights</h1>
        {Error && <p className={styles.errorMessage}>{Error}</p>}

        <fieldset className={styles.tripTypeGroup}>
          <legend>Trip</legend>
          <label>
            <input
              type="radio"
              name="tripType"
              value="oneWay"
              checked={tripType === "oneWay"}
              onChange={() => {
                setTripType("oneWay");
                setShowReturnPicker(false);
                if (inputReturn.current) inputReturn.current.value = "";
              }}
            />{" "}
            One Way
          </label>
          <label>
            <input
              type="radio"
              name="tripType"
              value="roundTrip"
              checked={tripType === "roundTrip"}
              onChange={() => {
                setTripType("roundTrip");
                setShowReturnPicker(true);
              }}
            />{" "}
            Round Trip
          </label>
        </fieldset>

        <form className={styles.bookingForm} onSubmit={handleSubmit}>
          {/* FROM */}
          <div className={styles.formCard}>
            <input type="text" id="fromCity" placeholder="City Name" ref={inputFrom} required />
            <label htmlFor="fromCity">From</label>
          </div>

          {/* TO */}
          <div className={styles.formCard}>
            <input type="text" id="toCity" placeholder="City Name" ref={inputTo} required />
            <label htmlFor="toCity">To</label>
          </div>

          {/* DEPARTURE */}
          <div className={styles.formCard}>
            <input
              type="date"
              id="departure"
              placeholder="Select Date"
              ref={inputDeparture}
              required
              min={minDate}
              max={maxDate}
              onChange={() => {
                if (inputReturn.current) {
                  inputReturn.current.min = inputDeparture.current.value || minDate;
                  if (
                    inputReturn.current.value &&
                    inputReturn.current.value <= inputDeparture.current.value
                  ) {
                    inputReturn.current.value = inputDeparture.current.value;
                  }
                }
              }}
            />
            <label htmlFor="departure">Departure</label>
          </div>

          {/* RETURN */}
          <div className={styles.formCard}>
            {!showReturnPicker ? (
              <div
                className={styles.returnPlaceholder}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setTripType("roundTrip");
                  setShowReturnPicker(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setTripType("roundTrip");
                    setShowReturnPicker(true);
                  }
                }}
              >
                <span className={styles.returnTitle}>Return</span>
                <span className={styles.returnHint}>Tap to add a return date</span>
              </div>
            ) : (
              <>
                <input
                  type="date"
                  id="Return"
                  placeholder="Select Date"
                  ref={inputReturn}
                  disabled={tripType !== "roundTrip"}
                  required={tripType === "roundTrip"}
                  min={inputDeparture.current?.value || minDate}
                  max={maxDate}
                />
                <label htmlFor="Return">Return</label>
              </>
            )}
          </div>

          {/* SEARCH BUTTON */}
          <button
            className={`${styles.searchBtn} ${loading ? styles.loading : ""}`}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.loader}></span>
                <span style={{ marginLeft: "8px" }}>Searching...</span>
              </>
            ) : (
              "Search Flights"
            )}
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default Bookingcard;
