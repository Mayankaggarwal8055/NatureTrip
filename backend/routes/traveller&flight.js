const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();
const { createFlightOfferRecord } = require('../utils/createFlightOffer');

/**
 * Helper: Map frontend flight selection ID to flight + selected itinerary
 */
function getFlightFromSelection(selectedId, flights) {
  if (!selectedId) return null; // for one-way inbound, may not exist

  const [numStr, direction] = selectedId.split('-'); // e.g., ["15", "out"]
  const index = parseInt(numStr, 10) - 1;           // convert to 0-based index
  const flight = flights[index];
  if (!flight) throw new Error(`Flight not found at index ${index}`);

  // Choose itinerary based on direction
  let itineraryIndex = direction === 'in' ? 1 : 0;  // 0=outbound, 1=inbound
  if (!flight.itineraries[itineraryIndex]) itineraryIndex = 0; // fallback

  return {
    ...flight,
    selectedItinerary: flight.itineraries[itineraryIndex],
  };
}

router.post('/', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not logged in" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.userRecord.findUnique({ where: { id: verified.userId } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const userId = user.id;
    const { traveller, flight } = req.body;
    const { fareSelection, tripType, originalFlights } = flight;

    // Map selected outbound flight
    const selectedOutbound = getFlightFromSelection(fareSelection.outbound?.flightDetails?.id, originalFlights);

    // Map selected inbound flight only if it exists (round-trip)
    const selectedInbound = getFlightFromSelection(fareSelection.inbound?.flightDetails?.id, originalFlights);

    // Prepare flight data to save
    const flightToSave = {
      ...fareSelection,
      outbound: selectedOutbound,
      inbound: selectedInbound, // could be null for one-way
      totalPrice: fareSelection.totalPrice,
      totalPriceINR: fareSelection.totalPriceINR,
    };

    // 1️⃣ Save flight offer in DB
    const flightOfferRecord = await createFlightOfferRecord(flightToSave, userId, tripType);

    // 2️⃣ Create traveller with unique ticket
    const travellerRecord = await prisma.traveller.create({
      data: {
        firstName: traveller.firstName,
        lastName: traveller.lastName,
        gender: traveller.gender,
        countryCode: traveller.countryCode,
        mobileNumber: traveller.mobileNumber,
        email: traveller.email,
        gstNumber: traveller.gstNumber,
        state: traveller.state,
        ticketNumber: `TICKET-${uuidv4()}`,
        status: "pending",
        user: { connect: { id: userId } },
      },
    });

    res.status(201).json({ traveller: travellerRecord, flightOffer: flightOfferRecord });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

module.exports = router;
