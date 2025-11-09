import axios from "axios";

const handleCheapFlight = async (flightData) => {
    try {
        const response = await axios.get('http://localhost:4444/api/flights/search', {
            params: {
                origin: flightData.from,
                destination: flightData.to,
                departureDate: flightData.departure,
                returnDate: flightData.return
            }
        });
        

        return response.data;  // flight offers array
    } catch (error) {
        console.error("Error submitting flight data:", error);
        return { error: "Failed to fetch flights" };
    }
};

export default handleCheapFlight;
