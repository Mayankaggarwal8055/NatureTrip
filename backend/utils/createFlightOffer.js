const { PrismaClient } = require('../src/generated/prisma');
const { parseISO } = require('date-fns');

const prisma = new PrismaClient();

async function createFlightOfferRecord(flightToSave, userId, tripType) {
    


    try {
        if (!flightToSave || !flightToSave.outbound) {
            console.error('Invalid flightToSave data:', flightToSave);
            return null;
        }

        const convertToISO = (dateString) => {
            if (!dateString) return null;
            const d = new Date(dateString);
            return isNaN(d.getTime()) ? null : d.toISOString();
        };


        const baseFare = parseFloat(flightToSave.outbound?.price?.base || 0) + parseFloat(flightToSave.inbound?.price?.base || 0);
        const totalFare = flightToSave.totalPriceINR;
        
        
        const currency = flightToSave.outbound?.price?.currency || flightToSave.inbound?.price?.currency || "INR";
        const outboundDate = flightToSave.outbound?.lastTicketingDate ? new Date(flightToSave.outbound.lastTicketingDate) : null;
        const inboundDate = flightToSave.inbound?.lastTicketingDate ? new Date(flightToSave.inbound.lastTicketingDate) : null;


        let lastTicketingDate = null;
        if (outboundDate && inboundDate) {
            lastTicketingDate = outboundDate > inboundDate ? outboundDate.toISOString() : inboundDate.toISOString();
        } else if (outboundDate) {
            lastTicketingDate = outboundDate.toISOString();
        } else if (inboundDate) {
            lastTicketingDate = inboundDate.toISOString();
        } else {
            lastTicketingDate = new Date().toISOString();
        }

        const travelerPricings = flightToSave.travelerPricings ?? [];

        // Collect all legs: outbound, inbound, additional trips
        const legs = [];
        if (flightToSave.outbound) legs.push(flightToSave.outbound);
        if (flightToSave.inbound) legs.push(flightToSave.inbound);
        if (flightToSave.trips && Array.isArray(flightToSave.trips)) legs.push(...flightToSave.trips);

        // Flatten segments for DB
        const allSegments = legs.flatMap((leg) =>
            leg.itineraries?.flatMap((it) => it.segments) || []
        );

        const segmentData = allSegments.map((seg) => ({
            departure: seg.departure?.iataCode || null,
            arrival: seg.arrival?.iataCode || null,
            departureTime: convertToISO(seg.departure?.at),
            arrivalTime: convertToISO(seg.arrival?.at),
            carrierCode: seg.carrierCode || null,
            flightNumber: seg.number || null,
            aircraft: seg.aircraft?.code || null,
            duration: seg.duration || null,
        }));

        // Create flightToSave offer in DB
        const record = await prisma.flightOffer.create({
            data: {
                userId,
                tripType,
                baseFare,
                totalFare,
                currency,
                lastTicketingDate,
                travelerPricings: JSON.stringify(travelerPricings),
                segments: { create: segmentData },
                rawFlightData: JSON.stringify(flightToSave),
            },
            include: { segments: true },
        });

        
        return record;
    } catch (error) {
        console.error('❌ Error creating flightToSave offer record:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = { createFlightOfferRecord };
