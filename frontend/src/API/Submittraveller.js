const HandleSubmitTraveller = async (travellerData, flightData) => {

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/traveller`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        traveller: travellerData,
        flight: flightData
      }),
       credentials: "include",
    });

    const data = await response.json();
    
    
    
    return data   //stores the returned api object come from backend that have travellerId

  } catch (err) {
    console.error("Fetch failed:", err);
  }
};

export default HandleSubmitTraveller;
