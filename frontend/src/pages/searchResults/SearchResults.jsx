import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StickySelectionBar from "../../components/BookingModal/bookingModalforRound/StickySelectionBar/StickySelectionBar";
import FlightCardForRound from "../../components/FlightCard/FlightCardForRound/FlightCardForRound";
import BookingModalforRound from "../../components/BookingModal/bookingModalforRound/bookingModalforRound";
import BookingModalOneWay from "../../components/BookingModal/bookingModelOneWay/bookingModelOneWay";
import FlightCardForOneWay from "../../components/FlightCard/FlightCardForOneWay/FlightCardForOneWay";
import styles from "./SearchResults.module.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flights = [], oneWay = true } = location.state || {};

  // Prepare outbound and inbound flights
  const outbound = useMemo(
    () =>
      flights
        .map((o, i) =>
          o?.itineraries?.[0]
            ? { ...o, id: `${o.id || i}-out`, itineraries: [o.itineraries[0]] }
            : null
        )
        .filter(Boolean),
    [flights]
  );

  const inbound = useMemo(
    () =>
      flights
        .map((o, i) =>
          o?.itineraries?.[1]
            ? { ...o, id: `${o.id || i}-in`, itineraries: [o.itineraries[1]] }
            : null
        )
        .filter(Boolean),
    [flights]
  );

  // Selected flights state
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedInbound, setSelectedInbound] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleBooking = (flight) => {
    setSelectedOutbound({
      flight,
      price: Number(flight?.price?.total ?? flight?.price?.grandTotal ?? 0),
      currency: flight?.price?.currency || "EUR",
    });
    setIsBookingOpen(true);
  };

  const handleLegSelect = ({ leg, checked, price, currency, flight }) => {
    const sel = checked ? { flight, price: Number(price), currency } : null;
    if (leg === "outbound") setSelectedOutbound(sel);
    if (leg === "inbound") setSelectedInbound(sel);
  };

  // Continue handlers
  const handleRoundTripContinue = (fareSelectionData) => {
    navigate("/results/TravellerDetails", {
      state: {
        fareSelection: fareSelectionData,
        tripType: "roundTrip",
        originalFlights: flights,
      },
    });
  };

  const handleOneWayContinue = (fareSelectionData) => {
    navigate("/results/TravellerDetails", {
      state: {
        fareSelection: fareSelectionData,
        tripType: "oneWay",
        originalFlights: flights,
      },
    });
  };

  const total = (selectedOutbound?.price || 0) + (selectedInbound?.price || 0);
  const canBook =
    (oneWay && !!selectedOutbound) ||
    (!oneWay && !!selectedOutbound && !!selectedInbound);

  return (
    <div className={styles.searchResultsContainer}>
      <div style={{ textAlign: "center" }}>
        <h1>The Flights You Are Searching</h1>
      </div>

      <div className="filter-flight-card-container">
        <div className={styles.flightsList}>
          {oneWay ? (
            flights.map((flight, index) => (

              <FlightCardForOneWay
                key={flight.id || index}
                flight={flight}
                onBookClick={() => handleBooking(flight)}
              />
            ))
          ) : (
            <FlightCardForRound
              outbound={outbound}
              inbound={inbound}
              onSelect={handleLegSelect}
            />
          )}
        </div>

        {/* One-way modal */}
        {oneWay && isBookingOpen && selectedOutbound?.flight && (
          <BookingModalOneWay
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            flight={selectedOutbound.flight}
            onContinue={handleOneWayContinue}
          />
        )}

        {/* Round-trip modal */}
        {!oneWay &&
          isBookingOpen &&
          selectedOutbound?.flight &&
          selectedInbound?.flight && (

            <BookingModalforRound
              isOpen={isBookingOpen}
              onClose={() => setIsBookingOpen(false)}
              flights={{
                outbound: selectedOutbound.flight,
                inbound: selectedInbound.flight,
              }}
              onContinue={handleRoundTripContinue}
            />
          )}

        {/* Sticky bar only for round-trip */}
        {!oneWay && (
          <StickySelectionBar
            tripType="roundTrip"
            outbound={selectedOutbound}
            inbound={selectedInbound}
            total={total}
            currency={
              selectedOutbound?.currency || selectedInbound?.currency || "EUR"
            }
            onClearOutbound={() => setSelectedOutbound(null)}
            onClearInbound={() => setSelectedInbound(null)}
            canBook={canBook}
            onBook={() => {
              if (!canBook) return;
              setIsBookingOpen(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SearchResults;
