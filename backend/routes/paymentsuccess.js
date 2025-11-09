const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature, travellerId} = req.body;
    
    try {
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(orderId + "|" + razorpayPaymentId)
            .digest("hex");

        if (expectedSignature === razorpaySignature) {
            await prisma.traveller.update({
                where: { id: travellerId },
                data: { status: 'paid' }
            })
            await prisma.paymentOrder.update({
                where: { razorpayId: razorpayOrderId },
                data: { status: "paid", paymentId: razorpayPaymentId },
            });
            return res.json({ success: true, message: "Payment verified successfully" });
        }

        res.status(400).json({ success: false, message: "Invalid signature" });
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Server error" });

    }
})

module.exports = router;