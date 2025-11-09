const verifyPayment = async (orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature, travellerId) => {

    try {

        const res = await fetch('http://localhost:4444/api/payment/Success', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                orderId,
                razorpayPaymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
                razorpaySignature: razorpay_signature,
                travellerId
            })
        })
        const data = await res.json();
        return data

    } catch (error) {
        console.error(error)
    }
}

export default verifyPayment