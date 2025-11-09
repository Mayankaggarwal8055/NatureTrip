import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import BoardingPass from "../boardingPass/BoardingPass";
import Confetti from "react-confetti";
import emailjs from "@emailjs/browser";
import styles from "./ConfirmationPage.module.css";

const ConfirmationPage = () => {
  const location = useLocation();
  const BookingData = location?.state || null;

  const [showCongrats, setShowCongrats] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const emailSentRef = useRef(false); // <-- prevents duplicate sends


  useEffect(() => {
    const timer = setTimeout(() => setShowCongrats(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!BookingData) {
    return (
      <div className={styles.page}>
        <div className={styles.center}>
          <p>No booking data available.</p>
        </div>
      </div>
    );
  }

  const { traveller, flight, order } = BookingData;

  const {
    origin,
    destination,
    firstDepartureTime,
    finalArrivalTime,
    marketingString,
    segmentsListForText,
  } = useMemo(() => {
    const segs = Array.isArray(flight?.segments) ? flight.segments : [];
    const first = segs[0] || {};
    const last = segs[segs.length - 1] || {};
    const origin = first?.departure || flight?.from || "N/A";
    const destination = last?.arrival || flight?.to || "N/A";
    const firstDepartureTime = first?.departureTime || flight?.departureTime || null;
    const finalArrivalTime = last?.arrivalTime || flight?.arrivalTime || null;

    const marketingString = segs
      .map((s) => `${s?.carrierCode || ""}${s?.flightNumber || ""}`.trim())
      .filter(Boolean)
      .join(" / ");

    const segmentsListForText = segs
      .map((s, idx) => {
        const dep = s?.departure || "N/A";
        const arr = s?.arrival || "N/A";
        const depT = s?.departureTime ? new Date(s.departureTime).toLocaleString() : "N/A";
        const arrT = s?.arrivalTime ? new Date(s.arrivalTime).toLocaleString() : "N/A";
        return `Leg ${idx + 1}: ${s?.carrierCode || ""}${s?.flightNumber || ""}  ${dep} ${depT} → ${arr} ${arrT}`;
      })
      .join("\n");

    return {
      origin,
      destination,
      firstDepartureTime,
      finalArrivalTime,
      marketingString,
      segmentsListForText,
    };
  }, [flight]);

  const buildTicketText = () => {
    const paxName = `${traveller.firstName || ""} ${traveller.lastName || ""}`.trim() || "Passenger";
    const email = traveller.email || order.travellerEmail || "N/A";
    const contact = traveller.mobileNumber || order.travellerContact || "N/A";
    const ticketNo = traveller.ticketNumber || order.ticketNumber || "N/A";
    const depStr = firstDepartureTime ? new Date(firstDepartureTime).toLocaleString() : "N/A";
    const arrStr = finalArrivalTime ? new Date(finalArrivalTime).toLocaleString() : "N/A";
    const amountStr =
      order.currency === "INR"
        ? `₹${(Number(order.amount || 0) / 100).toLocaleString()} ${order.currency}`
        : `${Number(order.amount || 0).toLocaleString()} ${order.currency}`;

    return `🌟 Flight E-Ticket 🌟

Traveller: ${paxName}
Email: ${email}
Contact: ${contact}
Ticket #: ${ticketNo}

Route: ${origin} → ${destination}
Flight(s): ${marketingString || "N/A"}
Departure: ${depStr}
Arrival: ${arrStr}

Segment Details:
${segmentsListForText || "N/A"}

Order: ${order.orderId || "N/A"}, Status: ${order.status ? "Success ✅" : "Failed ❌"}
Amount: ${amountStr}
`;
  };

  const handleDownloadTicket = () => {
    const content = buildTicketText();
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${traveller.ticketNumber || "ticket"}.txt`;
    link.click();
  };

  // Automatically send email after successful booking
  // Automatically send email after successful booking
  useEffect(() => {
    console.log("📧 Email Effect Triggered");

    if (emailSentRef.current || !traveller?.email || !(order.status === true || order.status === "Success")) {
      console.log("❌ Email not sent — condition failed");
      return;
    }

    const sendEmail = async () => {
      try {
        console.log("🚀 Sending email via EmailJS...");
        await emailjs.send(
          "service_bn09hen",
          "template_z4lwfzt",
          {
            email: traveller.email,
            from_name: "NatureTrip Flights ✈️",
            message: buildTicketText(),
          },
          "JaAiYOH_-tR6kS3nO"
        );
        console.log("✅ Email sent successfully!");
        emailSentRef.current = true; // mark as done
      } catch (error) {
        console.error("❌ Email send failed:", error);
      }
    };

    sendEmail();
  }, [traveller, order]);


  return (
    <div className={styles.page}>
      {showCongrats ? (
        <div className={styles.congratsAnim}>
          <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={1000} />
          <h1 className={styles.congratsText}>🎉 Congratulations! 🎉</h1>
          <p className={styles.congratsSub}>Your flight has been successfully booked.</p>
        </div>
      ) : (
        <div className={styles.flexCenter}>
          <BoardingPass traveller={traveller} flight={flight} order={order} />
          <div className={styles.actionsRow}>
            <button className={styles.button} onClick={handleDownloadTicket}>
              Download E-Ticket
            </button>
            <button
              className={styles.buttonAlt}
              onClick={() => alert("Receipt feature coming soon!")}
            >
              View Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationPage;
