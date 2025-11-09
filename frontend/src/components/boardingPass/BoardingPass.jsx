import React, { useMemo } from "react";
import styles from "./BoardingPass.module.css";

export default function BoardingPass({ traveller, flight, order }) {
  // Helper functions for formatting
  const fmtTime = (iso) =>
    iso
      ? new Date(iso).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "—";

  const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("en-IN") : "—";

  // Derive display fields from provided flight data
  const { paxName, origin, destination, boardingTime, flightDate, displayFlight } =
    useMemo(() => {
      const firstName = traveller?.firstName || "";
      const lastName = traveller?.lastName || "";
      const paxName = `${firstName} ${lastName}`.trim() || "Passenger";

      const segs = Array.isArray(flight?.segments) ? flight.segments : [];
      const first = segs[0] || {};
      const last = segs[segs.length - 1] || {};

      const origin = first?.departure || flight?.from || "—";
      const destination = last?.arrival || flight?.to || "—";
      const boardingTime = first?.departureTime
        ? fmtTime(first.departureTime)
        : flight?.departureTime
        ? fmtTime(flight.departureTime)
        : "—";
      const flightDate = first?.departureTime
        ? fmtDate(first.departureTime)
        : flight?.departureTime
        ? fmtDate(flight.departureTime)
        : "—";

      const displayFlight = first
        ? `${first?.carrierCode || ""}${first?.flightNumber || ""}`.trim() || "—"
        : flight?.flightNumber || "—";

      return { paxName, origin, destination, boardingTime, flightDate, displayFlight };
    }, [traveller, flight]);

  return (
    <article className={styles.pass} role="region" aria-labelledby="bp-title">
      <section className={styles.stubLeft}>
        <div className={styles.vert}>FIRST CLASS</div>
        <div className={styles.barcode} aria-hidden="true" />
      </section>

      <section className={styles.main}>
        <header className={styles.mainHead}>
          <h2 id="bp-title" className={styles.brand}>BOARDING PASS</h2>
          <div className={styles.flyIcon}>✈︎</div>
        </header>

        <div className={styles.row}>
          <div className={styles.block}>
            <span className={styles.k}>NAME OF PASSENGER</span>
            <span className={styles.v}>{paxName}</span>
          </div>
          <div className={styles.blockSmall}>
            <span className={styles.k}>Boarding Time</span>
            <span className={styles.v}>{boardingTime}</span>
          </div>
          <div className={styles.blockSmall}>
            <span className={styles.k}>Flight</span>
            <span className={styles.v}>{displayFlight}</span>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.block}>
            <span className={styles.k}>FROM</span>
            <span className={styles.v}>{origin}</span>
          </div>
          <div className={styles.block}>
            <span className={styles.k}>TO</span>
            <span className={styles.v}>{destination}</span>
          </div>
          <div className={styles.blockSmall}>
            <span className={styles.k}>SEAT</span>
            <span className={styles.v}>{traveller?.seat || "—"}</span>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.block}>
            <span className={styles.k}>FLIGHT DATE</span>
            <span className={styles.v}>{flightDate}</span>
          </div>
          <div className={styles.block}>
            <span className={styles.k}>TICKET #</span>
            <span className={styles.v}>{traveller?.ticketNumber || order?.ticketNumber || "—"}</span>
          </div>
          <div className={styles.blockSmall}>
            <span className={styles.k}>GATE</span>
            <span className={styles.v}>{traveller?.gate || "—"}</span>
          </div>
        </div>
      </section>

      <section className={styles.stubRight}>
        <h3 className={styles.brandSmall}>Boarding Pass</h3>
        <div className={styles.nameBig}>{traveller?.firstName} {traveller?.lastName}</div>
        <div className={styles.meta}>
          <div><span className={styles.k}>From</span><span className={styles.v}>{origin}</span></div>
          <div><span className={styles.k}>To</span><span className={styles.v}>{destination}</span></div>
          <div><span className={styles.k}>Date</span><span className={styles.v}>{flightDate}</span></div>
          <div><span className={styles.k}>Boarding</span><span className={styles.v}>{boardingTime}</span></div>
        </div>
      </section>
    </article>
  );
}
