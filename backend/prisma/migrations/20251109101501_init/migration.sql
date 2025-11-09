-- CreateTable
CREATE TABLE "UserRecord" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "gender" TEXT,
    "dob" TIMESTAMP(3),
    "mobile" TEXT,
    "passport" TEXT,
    "expiryDate" TIMESTAMP(3),

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Traveller" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gstNumber" TEXT,
    "state" TEXT NOT NULL,
    "ticketNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Traveller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentOrder" (
    "id" TEXT NOT NULL,
    "razorpayId" TEXT NOT NULL,
    "travellerId" TEXT NOT NULL,
    "flightOfferId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "receipt" TEXT NOT NULL,
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightOffer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tripType" TEXT NOT NULL,
    "baseFare" DOUBLE PRECISION,
    "totalFare" DOUBLE PRECISION,
    "currency" TEXT,
    "lastTicketingDate" TIMESTAMP(3),
    "travelerPricings" TEXT,
    "rawFlightData" TEXT,

    CONSTRAINT "FlightOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Segment" (
    "id" TEXT NOT NULL,
    "flightOfferId" TEXT NOT NULL,
    "departure" TEXT,
    "arrival" TEXT,
    "departureTime" TIMESTAMP(3),
    "arrivalTime" TIMESTAMP(3),
    "carrierCode" TEXT,
    "flightNumber" TEXT,
    "aircraft" TEXT,
    "duration" TEXT,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRecord_name_key" ON "UserRecord"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserRecord_email_key" ON "UserRecord"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_mobile_key" ON "UserProfile"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_passport_key" ON "UserProfile"("passport");

-- CreateIndex
CREATE UNIQUE INDEX "Traveller_ticketNumber_key" ON "Traveller"("ticketNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOrder_razorpayId_key" ON "PaymentOrder"("razorpayId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traveller" ADD CONSTRAINT "Traveller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "Traveller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_flightOfferId_fkey" FOREIGN KEY ("flightOfferId") REFERENCES "FlightOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightOffer" ADD CONSTRAINT "FlightOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_flightOfferId_fkey" FOREIGN KEY ("flightOfferId") REFERENCES "FlightOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
