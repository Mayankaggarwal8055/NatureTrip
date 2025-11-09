import React, { useState, useEffect } from "react";
import styles from "./BookingModalforRound.module.css";

const BookingModalforRound = ({ isOpen, onClose, flights, onContinue }) => {
    const [selectedOutboundFareType, setSelectedOutboundFareType] = useState("economy");
    const [selectedInboundFareType, setSelectedInboundFareType] = useState("economy");
    const [selectedOutboundFare, setSelectedOutboundFare] = useState(0);
    const [selectedInboundFare, setSelectedInboundFare] = useState(0);
    const [activeTab, setActiveTab] = useState("outbound");
    const [totalPrice, setTotalPrice] = useState(0);

    if (!isOpen || !flights) return null;
    const { outbound, inbound } = flights;

    const parseDuration = (duration) => {
        const match = duration.match(/PT(\d+)H(\d+)M/);
        if (match) return `${match[1]}h ${match[2]}m`;
        return duration;
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const time = date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
        const day = date.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "2-digit",
        });
        return { time, day };
    };

    const convertToINR = (eurAmount) => {
        const rate = 89.5;
        return Math.round(eurAmount * rate);
    };

    const getBasePrice = (flightData, fareType) => {
        const basePrice = parseFloat(flightData?.price?.total || 0);
        return fareType === "business" ? basePrice * 2.5 : basePrice;
    };

    const getFareOptions = (flightData, fareType) => {
        const basePrice = getBasePrice(flightData, fareType);

        return [
            {
                type: "xpress_value",
                price: basePrice,
                multiplier: 1,
                label: "XPRESS VALUE",
                features: {
                    baggage: ["7 Kgs Cabin Baggage", "15 Kgs Check-in Baggage"],
                    flexibility: [
                        {
                            text: "Cancellation fee starts at ₹4,300 (up to 2 hours before departure)",
                            chargeable: true,
                        },
                        {
                            text: "Date Change fee starts at ₹3,000 up to 2 hrs before departure",
                            chargeable: true,
                        },
                    ],
                    meals: [
                        { text: "Chargeable Seats", chargeable: true },
                        { text: "Chargeable Meals", chargeable: true },
                    ],
                },
            },
            {
                type: "fare_by_mmt",
                price: basePrice * 1.06,
                multiplier: 1.06,
                label: "FARE BY MAKEMYTRIP",
                features: {
                    baggage: ["7 Kgs Cabin Baggage", "15 Kgs Check-in Baggage"],
                    flexibility: [
                        {
                            text: "Cancellation fee starts at ₹4,300 (up to 2 hours before departure)",
                            chargeable: true,
                        },
                        {
                            text: "Date Change fee starts at ₹3,000 up to 2 hrs before departure",
                            chargeable: true,
                        },
                    ],
                    meals: [
                        { text: "Chargeable Seats", chargeable: true },
                        { text: "Chargeable Meals", chargeable: true },
                    ],
                    benefits: {
                        amount: "299",
                        text: "Travel Insurance for 10 days",
                    },
                },
                specialTag: "MMTSPECIAL",
            },
            {
                type: "xpress_flex",
                price: basePrice * 1.09,
                multiplier: 1.09,
                label: "XPRESS FLEX",
                features: {
                    baggage: ["7 Kgs Cabin Baggage", "15 Kgs Check-in Baggage"],
                    flexibility: [
                        {
                            text: "Free Date Change up to 2 hrs before departure",
                            chargeable: false,
                        },
                    ],
                    meals: [
                        { text: "Free Seat", chargeable: false },
                        { text: "Complimentary Meal", chargeable: false },
                    ],
                },
            },
        ];
    };

    const outboundFares = getFareOptions(outbound, selectedOutboundFareType);
    const inboundFares = getFareOptions(inbound, selectedInboundFareType);

    useEffect(() => {
        const outboundPrice = outboundFares[selectedOutboundFare]?.price || 0;
        const inboundPrice = inboundFares[selectedInboundFare]?.price || 0;
        setTotalPrice(outboundPrice + inboundPrice);
    }, [
        selectedOutboundFare,
        selectedInboundFare,
        selectedOutboundFareType,
        selectedInboundFareType,
    ]);

    const handleOutboundFareTypeChange = (fareType) => {
        setSelectedOutboundFareType(fareType);
        setSelectedOutboundFare(0);
    };

    const handleInboundFareTypeChange = (fareType) => {
        setSelectedInboundFareType(fareType);
        setSelectedInboundFare(0);
    };

    const handleContinue = () => {
        const selectedOutboundFareData = outboundFares[selectedOutboundFare];
        const selectedInboundFareData = inboundFares[selectedInboundFare];

        const fareSelectionData = {
            outbound: {
                cabinClass: selectedOutboundFareType,
                fareType: selectedOutboundFareData.type,
                fareLabel: selectedOutboundFareData.label,
                price: selectedOutboundFareData.price,
                priceINR: convertToINR(selectedOutboundFareData.price),
                features: selectedOutboundFareData.features,
                specialTag: selectedOutboundFareData.specialTag || null,
                flightDetails: outbound,
            },
            inbound: {
                cabinClass: selectedInboundFareType,
                fareType: selectedInboundFareData.type,
                fareLabel: selectedInboundFareData.label,
                price: selectedInboundFareData.price,
                priceINR: convertToINR(selectedInboundFareData.price),
                features: selectedInboundFareData.features,
                specialTag: selectedInboundFareData.specialTag || null,
                flightDetails: inbound,
            },
            totalPrice: totalPrice,
            totalPriceINR: convertToINR(totalPrice),
            currency: "EUR",
        };

        if (onContinue) onContinue(fareSelectionData);
        onClose();
    };

    const renderFlightSegment = (segment, index) => {
        const departure = formatDateTime(segment.departure.at);
        const arrival = formatDateTime(segment.arrival.at);

        return (
            <div key={index} className={styles.segmentInfo}>
                <div className={styles.airlineInfo}>
                    <span className={styles.airlineName}>
                        {segment.carrierCode} {segment.number}
                    </span>
                    <span className={styles.duration}>
                        {parseDuration(segment.duration)}
                    </span>
                </div>
                <div className={styles.routeInfo}>
                    <div className={styles.cityTime}>
                        <span className={styles.time}>{departure.time}</span>
                        <span className={styles.city}>{segment.departure.iataCode}</span>
                    </div>
                    <div className={styles.arrow}>→</div>
                    <div className={styles.cityTime}>
                        <span className={styles.time}>{arrival.time}</span>
                        <span className={styles.city}>{segment.arrival.iataCode}</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderFareOption = (fareData, index, isSelected, onSelect) => {
        const inrPrice = convertToINR(fareData.price);

        return (
            <div
                key={index}
                className={`${styles.fareCard} ${isSelected ? styles.selectedFare : ""}`}
                onClick={() => onSelect(index)}
            >
                <div className={styles.fareHeader}>
                    <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => onSelect(index)}
                        className={styles.radioInput}
                    />
                    <div className={styles.farePrice}>
                        <span className={styles.rupeeSymbol}>₹</span>
                        <span className={styles.amount}>
                            {inrPrice.toLocaleString("en-IN")}
                        </span>
                        <span className={styles.perAdult}>per adult</span>
                    </div>
                    {fareData.specialTag && (
                        <div className={styles.specialTag}>{fareData.specialTag}</div>
                    )}
                </div>
                <div className={styles.fareLabel}>{fareData.label}</div>

                <div className={styles.featuresSection}>
                    <div className={styles.featureGroup}>
                        <div className={styles.featureTitle}>Baggage</div>
                        {fareData.features.baggage.map((item, idx) => (
                            <div key={idx} className={styles.featureItem}>
                                <span className={styles.checkIcon}>✓</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.featureGroup}>
                        <div className={styles.featureTitle}>Flexibility</div>
                        {fareData.features.flexibility.map((item, idx) => (
                            <div
                                key={idx}
                                className={`${styles.featureItem} ${item.chargeable ? styles.chargeableItem : ""
                                    }`}
                            >
                                <span className={styles.checkIcon}>
                                    {item.chargeable ? "⊕" : "✓"}
                                </span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.featureGroup}>
                        <div className={styles.featureTitle}>Seats, Meals & More</div>
                        {fareData.features.meals.map((item, idx) => (
                            <div
                                key={idx}
                                className={`${styles.featureItem} ${item.chargeable ? styles.chargeableItem : ""
                                    }`}
                            >
                                <span className={styles.checkIcon}>
                                    {item.chargeable ? "⊕" : "✓"}
                                </span>
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {fareData.features.benefits && (
                    <div className={styles.benefitsBox}>
                        <div className={styles.benefitsTitle}>
                            BENEFITS WORTH ₹{fareData.features.benefits.amount} INCLUDED
                        </div>
                        <div className={styles.benefitItem}>
                            <span className={styles.shieldIcon}>🛡️</span>
                            <span>{fareData.features.benefits.text}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Flight Details and Fare Options available for you!</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.tabContainer}>
                    <button
                        className={`${styles.tab} ${activeTab === "outbound" ? styles.activeTab : ""
                            }`}
                        onClick={() => setActiveTab("outbound")}
                    >
                        DEPART: {outbound?.itineraries[0]?.segments[0]?.departure?.iataCode} -{" "}
                        {
                            outbound?.itineraries[0]?.segments[
                                outbound?.itineraries[0]?.segments.length - 1
                            ]?.arrival?.iataCode
                        }
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "inbound" ? styles.activeTab : ""
                            }`}
                        onClick={() => setActiveTab("inbound")}
                    >
                        RETURN: {inbound?.itineraries[0]?.segments[0]?.departure?.iataCode} -{" "}
                        {
                            inbound?.itineraries[0]?.segments[
                                inbound?.itineraries[0]?.segments.length - 1
                            ]?.arrival?.iataCode
                        }
                    </button>
                </div>

                <div className={styles.flightDetails}>
                    {activeTab === "outbound" &&
                        outbound?.itineraries[0]?.segments.map((segment, idx) =>
                            renderFlightSegment(segment, idx)
                        )}
                    {activeTab === "inbound" &&
                        inbound?.itineraries[0]?.segments.map((segment, idx) =>
                            renderFlightSegment(segment, idx)
                        )}
                </div>

                {/* Fare Type Selector */}
                <div className={styles.fareTypeSelector}>
                    {activeTab === "outbound" && (
                        <>
                            <button
                                className={`${styles.fareTypeBtn} ${selectedOutboundFareType === "economy"
                                        ? styles.activeFareType
                                        : ""
                                    }`}
                                onClick={() => handleOutboundFareTypeChange("economy")}
                            >
                                <div>Economy</div>
                                <div className={styles.fareTypeSubtext}>
                                    Starting at ₹
                                    {convertToINR(
                                        parseFloat(outbound?.price?.total || 0)
                                    ).toLocaleString("en-IN")}
                                </div>
                                <div className={styles.fareTypeDesc}>
                                    Affordable fares & value for money
                                </div>
                            </button>
                            <button
                                className={`${styles.fareTypeBtn} ${selectedOutboundFareType === "business"
                                        ? styles.activeFareType
                                        : ""
                                    }`}
                                onClick={() => handleOutboundFareTypeChange("business")}
                            >
                                <div>Business Class</div>
                                <div className={styles.fareTypeSubtext}>
                                    Starting at ₹
                                    {convertToINR(
                                        parseFloat(outbound?.price?.total || 0) * 2.5
                                    ).toLocaleString("en-IN")}
                                </div>
                                <div className={styles.fareTypeDesc}>
                                    Luxury experience with premium services
                                </div>
                            </button>
                        </>
                    )}

                    {activeTab === "inbound" && (
                        <>
                            <button
                                className={`${styles.fareTypeBtn} ${selectedInboundFareType === "economy"
                                        ? styles.activeFareType
                                        : ""
                                    }`}
                                onClick={() => handleInboundFareTypeChange("economy")}
                            >
                                <div>Economy</div>
                                <div className={styles.fareTypeSubtext}>
                                    Starting at ₹
                                    {convertToINR(
                                        parseFloat(inbound?.price?.total || 0)
                                    ).toLocaleString("en-IN")}
                                </div>
                                <div className={styles.fareTypeDesc}>
                                    Affordable fares & value for money
                                </div>
                            </button>
                            <button
                                className={`${styles.fareTypeBtn} ${selectedInboundFareType === "business"
                                        ? styles.activeFareType
                                        : ""
                                    }`}
                                onClick={() => handleInboundFareTypeChange("business")}
                            >
                                <div>Business Class</div>
                                <div className={styles.fareTypeSubtext}>
                                    Starting at ₹
                                    {convertToINR(
                                        parseFloat(inbound?.price?.total || 0) * 2.5
                                    ).toLocaleString("en-IN")}
                                </div>
                                <div className={styles.fareTypeDesc}>
                                    Luxury experience with premium services
                                </div>
                            </button>
                        </>
                    )}
                </div>

                <div className={styles.fareOptionsContainer}>
                    {activeTab === "outbound" &&
                        outboundFares.map((fare, idx) =>
                            renderFareOption(
                                fare,
                                idx,
                                selectedOutboundFare === idx,
                                setSelectedOutboundFare
                            )
                        )}
                    {activeTab === "inbound" &&
                        inboundFares.map((fare, idx) =>
                            renderFareOption(
                                fare,
                                idx,
                                selectedInboundFare === idx,
                                setSelectedInboundFare
                            )
                        )}
                </div>

                <div className={styles.modalFooter}>
                    <div className={styles.totalPrice}>
                        <span className={styles.totalLabel}>ROUNDTRIP FOR 1 ADULT</span>
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

export default BookingModalforRound;
