import React, { useMemo, useState, useEffect } from "react";
import styles from "./BookingModelOneWay.module.css"; // You can reuse BookingModalforRound.module.css

const BookingModalOneWay = ({ isOpen, onClose, flight, onContinue }) => {
  const [selectedFareType, setSelectedFareType] = useState("economy"); // economy | business
  const [selectedFareIndex, setSelectedFareIndex] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  if (!isOpen || !flight) return null;

  // Helpers
  const parseDuration = (duration) => {
    // Expect ISO-8601 like "PT13H45M"
    const m = duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!m) return duration || "";
    const h = m[1] ? `${m[1]}h` : "";
    const mm = m[2] ? `${m[2]}m` : "";
    return `${h} ${mm}`.trim();
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      time: date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      day: date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }),
    };
  };

  const convertToINR = (eurAmount) => {
    const rate = 89.5; // adjust or inject dynamically
    return Math.round((parseFloat(eurAmount || 0) || 0) * rate);
  };

  const baseEUR = parseFloat(flight?.price?.total || 0);
  const baseForCabin = selectedFareType === "business" ? baseEUR * 2.5 : baseEUR;

  // Extract included baggage from travelerPricings -> fareDetailsBySegment (if present)
  const included = useMemo(() => {
    const tp = flight?.travelerPricings?.[0];
    const fd = tp?.fareDetailsBySegment?.[0];
    const cabinWeight = fd?.includedCabinBags?.weight;
    const cabinUnit = fd?.includedCabinBags?.weightUnit || "KG";
    const checkedQty = fd?.includedCheckedBags?.quantity ?? 0;
    return {
      cabin: cabinWeight ? `${cabinWeight} ${cabinUnit} Cabin Baggage` : "Cabin baggage included",
      checked: checkedQty > 0 ? `${checkedQty} Check-in Bag(s)` : "No check-in baggage included",
    };
  }, [flight]);

  // Fare options (outbound only)
  const fareOptions = useMemo(() => {
    return [
      {
        type: "xpress_value",
        price: baseForCabin,
        multiplier: 1,
        label: "XPRESS VALUE",
        features: {
          baggage: [included.cabin, included.checked],
          flexibility: [
            { text: "Cancellation fee starts at ₹4,300 (up to 2 hours before departure)", chargeable: true },
            { text: "Date Change fee starts at ₹3,000 up to 2 hrs before departure", chargeable: true },
          ],
          meals: [
            { text: "Chargeable Seats", chargeable: true },
            { text: "Chargeable Meals", chargeable: true },
          ],
        },
      },
      {
        type: "fare_by_mmt",
        price: baseForCabin * 1.06,
        multiplier: 1.06,
        label: "FARE BY MAKEMYTRIP",
        features: {
          baggage: [included.cabin, included.checked],
          flexibility: [
            { text: "Cancellation fee starts at ₹4,300 (up to 2 hours before departure)", chargeable: true },
            { text: "Date Change fee starts at ₹3,000 up to 2 hrs before departure", chargeable: true },
          ],
          meals: [
            { text: "Chargeable Seats", chargeable: true },
            { text: "Chargeable Meals", chargeable: true },
          ],
          benefits: { amount: "299", text: "Travel Insurance for 10 days" },
        },
        specialTag: "MMTSPECIAL",
      },
      {
        type: "xpress_flex",
        price: baseForCabin * 1.09,
        multiplier: 1.09,
        label: "XPRESS FLEX",
        features: {
          baggage: [included.cabin, included.checked],
          flexibility: [{ text: "Free Date Change up to 2 hrs before departure", chargeable: false }],
          meals: [
            { text: "Free Seat", chargeable: false },
            { text: "Complimentary Meal", chargeable: false },
          ],
        },
      },
    ];
  }, [baseForCabin, included]);

  useEffect(() => {
    setTotalPrice(fareOptions[selectedFareIndex]?.price || 0);
  }, [fareOptions, selectedFareIndex, selectedFareType]);

  const handleFareTypeChange = (fareType) => {
    setSelectedFareType(fareType);
    setSelectedFareIndex(0);
  };

  const handleContinue = () => {
    const selectedFare = fareOptions[selectedFareIndex];
    const data = {
      cabinClass: selectedFareType,
      outbound: {
        fareType: selectedFare.type,
        fareIndex: selectedFareIndex,
        fareLabel: selectedFare.label,
        price: selectedFare.price,
        priceINR: convertToINR(selectedFare.price),
        multiplier: selectedFare.multiplier,
        features: selectedFare.features,
        specialTag: selectedFare.specialTag || null,
        flightDetails: flight,
      },
      totalPrice: selectedFare.price,
      totalPriceINR: convertToINR(selectedFare.price),
      currency: flight?.price?.currency || "EUR",
    };
    onContinue?.(data);
    onClose?.();
  };

  const renderSegment = (segment, idx) => {
    const dep = formatDateTime(segment.departure.at);
    const arr = formatDateTime(segment.arrival.at);
    return (
      <div key={idx} className={styles.segmentInfo}>
        <div className={styles.airlineInfo}>
          <span className={styles.airlineName}>
            {segment.carrierCode} {segment.number}
          </span>
          <span className={styles.duration}>{parseDuration(segment.duration)}</span>
        </div>
        <div className={styles.routeInfo}>
          <div className={styles.cityTime}>
            <span className={styles.time}>{dep.time}</span>
            <span className={styles.city}>{segment.departure.iataCode}</span>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.cityTime}>
            <span className={styles.time}>{arr.time}</span>
            <span className={styles.city}>{segment.arrival.iataCode}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderFareCard = (fare, idx, selected, onSelect) => {
    const inr = convertToINR(fare.price);
    return (
      <div
        className={`${styles.fareCard} ${selected ? styles.selectedFare : ""}`}
        onClick={() => onSelect(idx)}
      >
        <div className={styles.fareHeader}>
          <input
            type="radio"
            className={styles.radioInput}
            checked={selected}
            onChange={() => onSelect(idx)}
          />
          <div className={styles.farePrice}>
            <span className={styles.rupeeSymbol}>₹</span>
            <span className={styles.amount}>{inr.toLocaleString("en-IN")}</span>
            <span className={styles.perAdult}>per adult</span>
          </div>
          {fare.specialTag && <div className={styles.specialTag}>{fare.specialTag}</div>}
        </div>
        <div className={styles.fareLabel}>{fare.label}</div>

        <div className={styles.featuresSection}>
          <div className={styles.featureGroup}>
            <div className={styles.featureTitle}>Baggage</div>
            {fare.features.baggage.map((b, i) => (
              <div key={i} className={styles.featureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div className={styles.featureGroup}>
            <div className={styles.featureTitle}>Flexibility</div>
            {fare.features.flexibility.map((f, i) => (
              <div
                key={i}
                className={`${styles.featureItem} ${f.chargeable ? styles.chargeableItem : ""}`}
              >
                <span className={styles.checkIcon}>{f.chargeable ? "⊕" : "✓"}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          <div className={styles.featureGroup}>
            <div className={styles.featureTitle}>Seats, Meals & More</div>
            {fare.features.meals.map((m, i) => (
              <div
                key={i}
                className={`${styles.featureItem} ${m.chargeable ? styles.chargeableItem : ""}`}
              >
                <span className={styles.checkIcon}>{m.chargeable ? "⊕" : "✓"}</span>
                <span>{m.text}</span>
              </div>
            ))}
          </div>
        </div>

        {fare.features.benefits && (
          <div className={styles.benefitsBox}>
            <div className={styles.benefitsTitle}>
              BENEFITS WORTH ₹{fare.features.benefits.amount} INCLUDED
            </div>
            <div className={styles.benefitItem}>
              <span className={styles.shieldIcon}>🛡️</span>
              <span>{fare.features.benefits.text}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const segments = flight?.itineraries?.[0]?.segments || [];
  const origin = segments?.[0]?.departure?.iataCode;
  const destination = segments?.[segments.length - 1]?.arrival?.iataCode;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Flight Details and Fare Options available for you!</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.tabContainer}>
          <button className={`${styles.tab} ${styles.activeTab}`} disabled>
            DEPART: {origin} - {destination}
          </button>
        </div>

        <div className={styles.flightDetails}>
          {segments.map((seg, idx) => renderSegment(seg, idx))}
        </div>

        <div className={styles.fareTypeSelector}>
          <button
            className={`${styles.fareTypeBtn} ${selectedFareType === "economy" ? styles.activeFareType : ""}`}
            onClick={() => handleFareTypeChange("economy")}
          >
            <div>Economy</div>
            <div className={styles.fareTypeSubtext}>
              Starting at ₹{convertToINR(baseEUR).toLocaleString("en-IN")}
            </div>
            <div className={styles.fareTypeDesc}>Affordable fares & value for money</div>
          </button>

          <button
            className={`${styles.fareTypeBtn} ${selectedFareType === "business" ? styles.activeFareType : ""}`}
            onClick={() => handleFareTypeChange("business")}
          >
            <div>Business Class</div>
            <div className={styles.fareTypeSubtext}>
              Starting at ₹{convertToINR(baseEUR * 2.5).toLocaleString("en-IN")}
            </div>
            <div className={styles.fareTypeDesc}>Luxury experience with premium services</div>
          </button>
        </div>

        <div className={styles.fareOptionsContainer}>
          {fareOptions.map((fare, idx) =>
            renderFareCard(fare, idx, selectedFareIndex === idx, setSelectedFareIndex)
          )}
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.totalPrice}>
            <span className={styles.totalLabel}>ONE WAY FOR 1 ADULT</span>
            <span className={styles.totalAmount}>
              ₹ {convertToINR(totalPrice).toLocaleString("en-IN")}
            </span>
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.lockPriceBtn}>LOCK PRICE</button>
            <button className={styles.continueBtn} onClick={handleContinue}>
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModalOneWay;
