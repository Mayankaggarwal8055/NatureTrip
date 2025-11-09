const express = require('express');
const app = express();
const PORT = process.env.PORT || 4444;
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Middleware
app.use(cors({
  origin: 'https://nature-trip.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Routes
const travellerRoutes = require('./routes/traveller&flight');
const PaymentOrderRoute = require('./routes/paymentOrder');
const paymentSuccessRoute = require('./routes/paymentsuccess');
const SignUpRoute = require('./routes/signUp');
const loginRoute = require('./routes/login');
const verifyRoute = require('./routes/verify');
const profileUpdatedDataRoute = require('./routes/profileUpdatedData');
const CheapflightsRoute = require('./routes/Cheapflights');

app.use('/api/traveller', travellerRoutes);
app.use('/api/payment/order', PaymentOrderRoute);
app.use('/api/payment/Success', paymentSuccessRoute);
app.use('/api/SignUp', SignUpRoute);
app.use('/api/login', loginRoute);
app.use('/api/verify', verifyRoute);
app.use('/api/profileData', profileUpdatedDataRoute);
app.use('/api/flights/search', CheapflightsRoute);

// Optional health check
app.get('/', (req, res) => {
  res.send('✅ NatureTrip backend is running fine.');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
