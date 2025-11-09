-- CreateTable
CREATE TABLE "public"."UserRecord" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserProfile" (
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
CREATE TABLE "public"."Traveller" (
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
CREATE TABLE "public"."PaymentOrder" (
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
CREATE TABLE "public"."FlightOffer" (
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
CREATE TABLE "public"."Segment" (
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
CREATE UNIQUE INDEX "UserRecord_name_key" ON "public"."UserRecord"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserRecord_email_key" ON "public"."UserRecord"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_mobile_key" ON "public"."UserProfile"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_passport_key" ON "public"."UserProfile"("passport");

-- CreateIndex
CREATE UNIQUE INDEX "Traveller_ticketNumber_key" ON "public"."Traveller"("ticketNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOrder_razorpayId_key" ON "public"."PaymentOrder"("razorpayId");

-- AddForeignKey
ALTER TABLE "public"."UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."UserRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Traveller" ADD CONSTRAINT "Traveller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."UserRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentOrder" ADD CONSTRAINT "PaymentOrder_travellerId_fkey" FOREIGN KEY ("travellerId") REFERENCES "public"."Traveller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentOrder" ADD CONSTRAINT "PaymentOrder_flightOfferId_fkey" FOREIGN KEY ("flightOfferId") REFERENCES "public"."FlightOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentOrder" ADD CONSTRAINT "PaymentOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."UserRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FlightOffer" ADD CONSTRAINT "FlightOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."UserRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Segment" ADD CONSTRAINT "Segment_flightOfferId_fkey" FOREIGN KEY ("flightOfferId") REFERENCES "public"."FlightOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
