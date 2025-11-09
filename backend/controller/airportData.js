const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Load airports CSV
const airportsCsv = fs.readFileSync(path.join(__dirname, '../airport-data/data/airports_domestic_international.csv'), 'utf8');
const airports = parse(airportsCsv, { columns: true, skip_empty_lines: true, relax_column_count: true });

const cityToAirport = {};
airports.forEach(a => cityToAirport[a.city.toLowerCase()] = a);

module.exports = { airports, cityToAirport };
