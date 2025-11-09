import makePaymentOrder from "../API/paymentOrder";
import verifyPayment from "../API/paymentSuccess";

const paymentFunction = async (BookingData, navigate) => {


  if (!BookingData) {
    alert("No booking data found!");
    return;
  }

  const travellerId = BookingData.traveller.id;
  const flightId = BookingData.flightOffer.id;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpay = (paymentOrder) => {
    return new Promise(async (resolve, reject) => {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load.");
        return reject(new Error("Razorpay SDK failed to load"));
      }

      const options = {
        key: "rzp_test_RJmNLzlqZtJqil",
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "NatureTrip",
        description: "Flight Booking Payment",
        order_id: paymentOrder.orderId,
        handler: async function (response) {
          try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;


            const result = await verifyPayment(
              paymentOrder.orderId,
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              travellerId
            );

            resolve(result);
          } catch (err) {
            reject(err);
          }
        },
        prefill: {
          name: BookingData.traveller.name,
          email: BookingData.traveller.email,
          contact: BookingData.traveller.phone,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const handlePaymentClick = async () => {
    try {
      const paymentOrder = await makePaymentOrder(travellerId, flightId);

      if (!paymentOrder || paymentOrder.error) {
        alert("Cannot initiate payment: " + (paymentOrder?.error || "Unknown error"));
        return;
      }

      await openRazorpay(paymentOrder);

      navigate('/results/Traveller/confirmed', {
        state: {
          traveller: BookingData.traveller,
          flight: BookingData.flightOffer,
          order: paymentOrder,
        },
      })


    } catch (err) {
      console.error("Payment error:", err);
      alert("Cannot initiate payment: " + err.message);
    }
  };

  await handlePaymentClick();
};

export default paymentFunction
  ;
