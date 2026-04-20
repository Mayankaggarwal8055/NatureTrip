const express = require('express');
const router = express.Router();
const amadeus = require('../flightSearch/amadeus');

async function getAirportCode(cityName) {
  try {
    const response = await amadeus.referenceData.locations.get({
      keyword: cityName,
      subType: 'CITY,AIRPORT',
      "page[limit]": 5
    });

    if (!response.data || response.data.length === 0) {
      console.log("No data found for:", cityName);
      return null;
    }

    return response.data[0].iataCode;

  } catch (error) {
    console.error("Amadeus error:", error.response?.body || error.message);

    // 🔥 IMPORTANT: fallback logic
    const fallback = {
      Delhi: "DEL",
      Mumbai: "BOM",
      London: "LHR",
      Dubai: "DXB"
    };

    return fallback[cityName] || null;
  }
}

router.get('/', async (req, res) => {
  try {
    let { origin, destination, departureDate, returnDate } = req.query;

    // Convert city names to airport codes if needed
    origin = await getAirportCode(origin);
    destination = await getAirportCode(destination);

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Invalid city name provided' });
    }

    // Build params dynamically
    const params = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults: '1',
      max: 20
    };

    if (returnDate) params.returnDate = returnDate;

    const response = await amadeus.shopping.flightOffersSearch.get(params);

    res.json({
      flights: response.data,
      oneWay: !returnDate
    });

  } catch (err) {
    console.error(err);
    res.status(err.response?.status || 500).json({ error: 'Search failed' });
  }
});

module.exports = router;
