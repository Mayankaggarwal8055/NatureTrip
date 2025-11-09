const makePaymentOrder = async (travellerId, flightId) => {
    try {

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ travellerId, flightId }),
            credentials: 'include'
        });
        const data = await res.json();
        return data

        //yha tak data aa gya payment order ka 

    } catch (error) {
        console.error(error)
    }

}

export default makePaymentOrder