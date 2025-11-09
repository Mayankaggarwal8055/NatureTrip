const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate realistic flights between two cities
 * @param {number} count - number of flights to generate
 * @param {string} from - departure city
 * @param {string} to - arrival city
 * @param {string} departure - departure date string (YYYY-MM-DD)
 * @param {string} returnDate - return date string (optional)
 * @param {number} distance - distance in km between cities
 */
function generateFlights(count = 15, from, to, departure, returnDate, distance) {
    const flights = [];
    const planeSpeed = 800; // km/h average commercial flight speed
    const ratePerKm = 10;   // ₹10 per km
    const taxRate = 0.18;   // 18% tax

    for (let i = 0; i < count; i++) {
        // Flight duration in minutes
        const flightDurationHrs = distance / planeSpeed;
        const durationMins = Math.round(flightDurationHrs * 60);

        // Random departure time within first 6 hours of selected day
        const depTime = new Date(departure);
        depTime.setHours(depTime.getHours() + Math.floor(Math.random() * 6));

        // Arrival time based on duration
        const arrTime = new Date(depTime.getTime() + durationMins * 60 * 1000);

        // Price calculation based on distance with 80%-120% random factor
        const basePrice = distance * ratePerKm * (0.8 + Math.random() * 0.4);
        const totalPrice = Math.round(basePrice * (1 + taxRate));

        // Return flight (if provided)
        let returnFlight = null;
        if (returnDate) {
            const retDep = new Date(returnDate);
            retDep.setHours(retDep.getHours() + Math.floor(Math.random() * 6));
            const retArr = new Date(retDep.getTime() + durationMins * 60 * 1000);
            returnFlight = {
                departureTime: retDep.toISOString(),
                arrivalTime: retArr.toISOString(),
                duration: `${durationMins} mins`
            };
        }

        flights.push({
            id: uuidv4(),
            flightNumber: faker.string.alphanumeric({ length: 6 }).toUpperCase(),
            airline: faker.airline.airline(),
            from,
            to,
            departureTime: depTime.toISOString(),
            arrivalTime: arrTime.toISOString(),
            duration: `${durationMins} mins`,
            price: totalPrice,
            returnFlight
        });
    }

    return flights;
}

module.exports = generateFlights;
