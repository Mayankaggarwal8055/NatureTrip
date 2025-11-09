import React, { useMemo, useId, useState } from "react";
import styles from "./LegList.module.css";

const fmtTime = (iso) =>
    iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";

const legFromOffer = (offer) => {
    const it = offer?.itineraries?.[0];
    const segs = it?.segments || [];
    const first = segs[0];
    const last = segs[segs.length - 1];

    return {
        depCode: first?.departure?.iataCode || "—",
        depTime: fmtTime(first?.departure?.at),
        arrCode: last?.arrival?.iataCode || "—",
        arrTime: fmtTime(last?.arrival?.at),
        duration: (it?.duration || "PT0M").replace("PT", "").toLowerCase(),
        stops: Math.max((segs.length || 1) - 1, 0),
    };
};

const LegCard = ({ offer, onSelect, isSelected }) => {
    const cid = useId();
    const airline = offer?.validatingAirlineCodes?.[0] || "—";
    const leg = useMemo(() => legFromOffer(offer), [offer]);
    const stops = leg.stops;
    const stopLabel = stops === 0 ? "Non stop" : `${stops} stop${stops > 1 ? "s" : ""}`;
    const priceEUR = Number(offer?.price?.total || offer?.price?.grandTotal || 0);
    const priceINR = Math.round(priceEUR * 89.5);
    const currency = "₹";

    return (
        <div
            className={`${styles.card} ${isSelected ? styles.selected : ""}`}
            onClick={() =>
                onSelect({
                    flightId: offer?.id,
                    price: priceINR,
                    currency,
                    depCode: leg.depCode,
                    arrCode: leg.arrCode,
                    depTime: leg.depTime,
                    arrTime: leg.arrTime,
                    duration: leg.duration,
                    stops: stops,
                    offer, // pass the entire offer object up
                })
            }
        >
            <header className={styles.header}>
                <div className={styles.airline}>{airline}</div>
                <div className={styles.priceWrap}>
                    <span className={styles.priceLabel}>Price per person</span>
                    <span className={styles.priceValue}>
                        {currency} {priceINR.toLocaleString("en-IN")}
                    </span>
                </div>
            </header>

            <section className={styles.legMain}>
                <div className={styles.timeBlock}>
                    <div className={styles.city}>{leg.depCode}</div>
                    <div className={styles.time}>{leg.depTime}</div>
                </div>

                <div className={styles.durationBlock}>
                    <span className={styles.durationText}>{leg.duration}</span>
                    <div className={styles.durationLine}>
                        <span className={styles.planeIcon}>✈</span>
                        <span className={styles.stopBadge}>{stopLabel}</span>
                    </div>
                </div>

                <div className={styles.timeBlock}>
                    <div className={styles.city}>{leg.arrCode}</div>
                    <div className={styles.time}>{leg.arrTime}</div>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.pickBox}>
                    <input id={cid} type="checkbox" className={styles.pickInput} checked={isSelected} readOnly />
                    <label htmlFor={cid} className={styles.pickLabel}>
                        Pick • {currency} {priceINR.toLocaleString("en-IN")}
                    </label>
                </div>
            </footer>
        </div>
    );
};

const LegList = ({ items = [], onSelect }) => {
    const [selectedId, setSelectedId] = useState(null);

    const handleSelect = (flight) => {
        const newSelected = flight.flightId === selectedId ? null : flight.flightId;
        setSelectedId(newSelected);

        

        // Now include the raw offer as `flight`
        onSelect?.({
            checked: newSelected !== null,
            flight: flight.offer, // full raw offer
            ...flight, // keep summary data too
        });
    };

    return (
        <div className={styles.list}>
            {items.map((offer) => (
                <LegCard
                    key={offer.id}
                    offer={offer}
                    onSelect={handleSelect}
                    isSelected={selectedId === offer.id}
                />
            ))}
        </div>
    );
};

export default LegList;
