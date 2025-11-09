const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({});

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.userRecord.findUnique({
      where: { id: verified.userId },
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            gender: true,
            dob: true,
            mobile: true,
            passport: true,
            expiryDate: true
          }
        },
        travellers: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            ticketNumber: true,
            status: true,
            createdAt: true,
            paymentOrders: {
              orderBy: { createdAt: 'desc' },
              select: {
                id: true,
                razorpayId: true,
                paymentId: true,
                amount: true,
                status: true,
                receipt: true,
                createdAt: true,
                flightOffer: {
                  select: {
                    id: true,
                    tripType: true,
                    baseFare: true,
                    totalFare: true,
                    currency: true,
                    lastTicketingDate: true,
                    segments: {
                      orderBy: { departureTime: 'asc' },
                      select: {
                        departure: true,
                        arrival: true,
                        departureTime: true,
                        arrivalTime: true,
                        carrierCode: true,
                        flightNumber: true,
                        aircraft: true,
                        duration: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const mask = (v) => (v ? `****${String(v).slice(-4)}` : null);

    const shapeFlight = (fo) => {
      if (!fo) return null;
      const segs = fo.segments || [];
      const first = segs[0];
      const last = segs[segs.length - 1] || first;
      return {
        id: fo.id,
        tripType: fo.tripType,
        baseFare: fo.baseFare,
        totalFare: fo.totalFare,
        currency: fo.currency,
        lastTicketingDate: fo.lastTicketingDate,
        from: first?.departure || null,
        to: last?.arrival || null,
        departureTime: first?.departureTime || null,
        arrivalTime: last?.arrivalTime || null,
        carrier: first?.carrierCode || null,
        flightNumber: first?.flightNumber || null,
        stops: Math.max((segs?.length || 1) - 1, 0),
        segments: segs.map(s => ({
          from: s.departure,
          to: s.arrival,
          departureTime: s.departureTime,
          arrivalTime: s.arrivalTime,
          carrier: s.carrierCode,
          flightNumber: s.flightNumber,
          aircraft: s.aircraft,
          duration: s.duration
        }))
      };
    };

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      profile: {
        ...user.profile,
        passport: mask(user.profile?.passport)
      },
      travellers: user.travellers.map(t => ({
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        ticketNumber: t.ticketNumber,
        status: t.status,
        createdAt: t.createdAt,
        bookings: t.paymentOrders.map(po => ({
          paymentId: po.id,
          razorpayId: po.razorpayId,
          gatewayPaymentId: po.paymentId,
          amount: po.amount,
          currency: po.flightOffer?.currency || 'INR',
          status: po.status,
          receipt: po.receipt,
          createdAt: po.createdAt,
          flight: shapeFlight(po.flightOffer)
        }))
      }))
    };

    res.status(200).json({ user: response });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Not a user' });
  }
});

module.exports = router;
