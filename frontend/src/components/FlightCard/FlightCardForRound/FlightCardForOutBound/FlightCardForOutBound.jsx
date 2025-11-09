// FlightCard4.jsx (outbound column)
import React from "react";
import LegList from "../LegList/LegList";

const FlightCardForOutBound = ({ outbound = [], onSelect }) => {
  
  return <LegList items={outbound} onSelect={(s) => onSelect?.({ ...s, leg: "outbound" })} />;
};
export default FlightCardForOutBound;


