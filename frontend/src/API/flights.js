import axios from "axios";

const handleSubmitFlight = async (flightData) => {
    try {
        const response = await axios.post('http://localhost:4444/api/flights', flightData);
        return response.data;  // return the flight results
    } catch (error) {
        console.error("Error submitting flight data:", error);
    }
};

export default handleSubmitFlight;
