const express = require("express");
const router = express.Router();
const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();
const Razorpay = require('razorpay');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');

dotenv.config();

router.post('/', async (req, res) => {
    try {
        const { travellerId, flightId } = req.body;

        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Not logged in" });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const userId = verified.userId;

        // Fetch traveller
        const traveller = await prisma.traveller.findUnique({
            where: { id: travellerId }
        });
        if (!traveller) return res.status(404).json({ error: "Traveller not found" });

        // Fetch flight with segments
        const flight = await prisma.flightOffer.findUnique({
            where: { id: flightId },
            include: {
                segments: true,
                paymentOrders: true,
                user: true
            }
        });

        
        
        if (!flight) return res.status(404).json({ error: "Flight not found" });
        if (!flight.totalFare) return res.status(400).json({ error: "Flight price missing" });

        // Extract details
        const amount = Math.round(Number(flight.totalFare) * 100);
        const firstSegment = flight.segments?.[0];
        const flightNumber = firstSegment?.flightNumber || "N/A";
        const from = firstSegment?.departure || "N/A";
        const to = firstSegment?.arrival || "N/A";

        // Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        // Generate short receipt
        const shortTravellerId = traveller.id.slice(0, 8);
        const shortFlightId = flight.id.slice(0, 8);
        const shortTimestamp = Date.now().toString().slice(-6);
        const receipt = `rcpt_${shortTravellerId}_${shortFlightId}_${shortTimestamp}`;

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt,
            payment_capture: 1,
            notes: {
                travellerName: `${traveller.firstName} ${traveller.lastName}`,
                flightNumber,
                from,
                to,
                travellerEmail: traveller.email,
                travellerContact: traveller.mobileNumber,
            }
        });

        // Save to DB
        await prisma.paymentOrder.create({
            data: {
                razorpayId: order.id,
                travellerId: traveller.id,
                flightOfferId: flight.id,
                userId,
                amount,
                status: order.status,
                receipt: order.receipt,
            },
        });

        res.json({
            status: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            travellerName: `${traveller.firstName} ${traveller.lastName}`,
            travellerEmail: traveller.email,
            travellerContact: traveller.mobileNumber,
            flightNumber,
            from,
            to,
        });

    } catch (error) {
        console.error("❌ Payment creation failed:", error);
        res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
});

module.exports = router;
