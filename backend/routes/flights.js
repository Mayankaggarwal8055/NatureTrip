const express = require('express');
const router = express.Router();
const { cityToAirport } = require('../controller/airportData');
const generateFlights = require('../data/generateFlights');

// GET route: simple demo
router.get('/', (req, res) => {
    const { from, to } = req.query;
    const flights = generateFlights(15, from, to, new Date().toISOString());
    res.json(flights);
});

// POST route: realistic flights with validation
router.post('/', (req, res) => {
    const { from, to, departure, return: returnDate } = req.body;

    const fromAirport = cityToAirport[from.toLowerCase()];
    const toAirport = cityToAirport[to.toLowerCase()];

    const invalidCities = [];
    if (!fromAirport) invalidCities.push("from");
    if (!toAirport) invalidCities.push("to");

    if (invalidCities.length > 0) {
        return res.status(400).json({
            error: "One or more cities do not have an airport",
            invalidCities
        });
    }

    // Haversine formula for distance
    const distance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(lat1 * Math.PI / 180) *
                  Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const dist = distance(
        parseFloat(fromAirport.latitude_deg),
        parseFloat(fromAirport.longitude_deg),
        parseFloat(toAirport.latitude_deg),
        parseFloat(toAirport.longitude_deg)
    );

    // Generate flights
    const flights = generateFlights(
        15,
        from,
        to,
        departure,
        returnDate,
        dist
    );

    res.json(flights);
});
module.exports = router;
