import React, { useMemo } from "react";
import styles from "./FlightCardForOneWay.module.css";

const FlightCardForOneWay = ({ flight, onBookClick }) => {
    if (!flight) return null;

    const outbound = flight.itineraries?.[0];

    // Airline info
    const airlineCode = outbound?.segments?.[0]?.carrierCode || "N/A";
    const airlineName = flight.validatingAirlineCodes?.[0] || airlineCode;

    // Price conversion (EUR → INR example)
    const priceEUR = parseFloat(flight.price?.total || "0");
    const conversionRate = 100; // Example rate
    const priceINR = (priceEUR * conversionRate).toLocaleString("en-IN");

    // Traveler info
    const travelerPricing = flight.travelerPricings?.[0];
    const cabinBags = travelerPricing?.includedCabinBags?.quantity || 0;
    const checkedBags = travelerPricing?.includedCheckedBags?.quantity || 0;
    const cabinClass = travelerPricing?.cabin || "N/A";
    const fareType = flight.pricingOptions?.fareType?.join(", ") || "N/A";

    // === Time and Duration Fixes ===
    const formatTime = (isoString) => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        return date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const calculateDuration = (dep, arr) => {
        if (!dep || !arr) return "N/A";
        const depTime = new Date(dep).getTime();
        const arrTime = new Date(arr).getTime();
        const diff = arrTime - depTime;
        if (diff < 0) return "N/A";
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const formatLeg = (leg) => {
        if (!leg) return null;
        const dep = leg.segments?.[0];
        const arr = leg.segments?.[leg.segments.length - 1];
        return {
            depTime: formatTime(dep?.departure?.at),
            arrTime: formatTime(arr?.arrival?.at),
            depCode: dep?.departure?.iataCode || "N/A",
            arrCode: arr?.arrival?.iataCode || "N/A",
            duration: calculateDuration(dep?.departure?.at, arr?.arrival?.at),
            carrier: dep?.carrierCode || "N/A",
            flightNo: dep?.number || "N/A",
            segments: leg.segments || [],
            nextDay: new Date(arr?.arrival?.at).getDate() !== new Date(dep?.departure?.at).getDate(),
        };
    };

    const out = useMemo(() => formatLeg(outbound), [outbound]);
    const numberOfStops = (out?.segments?.length || 1) - 1;

    return (
        <div className={styles.flightCard}>
            {/* Header: Airline & Price */}
            <header className={styles.header}>
                <div className={styles.airlineName}>{airlineName}</div>
                <div className={styles.priceWrap}>
                    <span className={styles.priceLabel}>Price per person</span>
                    <span className={styles.priceValue}>₹ {priceINR}</span>
                </div>
            </header>

            {/* Outbound details */}
            <section className={styles.leg}>
                <div className={styles.legMain}>
                    <div className={styles.timeBlock}>
                        <div className={styles.city}>{out?.depCode}</div>
                        <div className={styles.time}>{out?.depTime}</div>
                    </div>

                    <div className={styles.durationBlock}>
                        <span className={styles.durationText}>{out?.duration}</span>
                        <div className={styles.durationLine}>
                            <span className={styles.planeIcon}>✈</span>
                        </div>
                    </div>

                    <div className={styles.timeBlock}>
                        <div className={styles.city}>{out?.arrCode}</div>
                        <div className={styles.time}>
                            {out?.arrTime}
                            {out?.nextDay && <span className={styles.nextDayTag}> +1 day</span>}
                        </div>
                    </div>
                </div>

                {/* Segment list */}
                <div className={styles.segmentList}>
                    {out?.segments?.map((seg, i) => (
                        <div key={i} className={styles.segmentRow}>
                            <div className={styles.segRoute}>
                                {seg.departure.iataCode} → {seg.arrival.iataCode}
                            </div>
                            <div className={styles.segMeta}>
                                {seg.carrierCode} {seg.number} • {seg.aircraft?.code || "N/A"} •{" "}
                                {(seg.duration || "").replace("PT", "").toLowerCase()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Extras */}
                <div className={styles.flightExtra}>
                    <span>Stops: {numberOfStops}</span>
                    <span>Cabin Bags: {cabinBags}</span>
                    <span>Checked Bags: {checkedBags}</span>
                    <span>Cabin: {cabinClass}</span>
                    <span>Fare Type: {fareType}</span>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <button className={styles.bookBtn} onClick={() => onBookClick(flight)}>
                    Book Now
                    <span className={styles.btnShine} />
                </button>
            </footer>
        </div>
    );
};

export default FlightCardForOneWay;
