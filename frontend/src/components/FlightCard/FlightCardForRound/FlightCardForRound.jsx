import React from "react";
import Flightcard4 from "./FlightCardForOutBound/FlightCardForOutBound";
import FlightCard5 from "./FlightCardForInBound/FlightCardForInBound";

const FlightCardForRound = ({ outbound = [], inbound = [], onSelect }) => {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Flightcard4 outbound={outbound} onSelect={onSelect} />
            <FlightCard5 inbound={inbound} onSelect={onSelect} />
        </div>
    );
};


export default FlightCardForRound;
