// FlightCard5.jsx (inbound column)
import React from "react";
import LegList from "../LegList/LegList";

const FlightCardForInBound = ({ inbound = [], onSelect }) => {
  return <LegList items={inbound} onSelect={(s) => onSelect?.({ ...s, leg: "inbound" })} />;
};
export default FlightCardForInBound;