const express = require('express');
const app = express();
const PORT = 4444;
const cors = require('cors')
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
const travellerRoutes = require('./routes/traveller&flight')
const PaymentOrderRoute = require('./routes/paymentOrder')
const paymentSuccessRoute = require('./routes/paymentsuccess');
const SignUpRoute = require('./routes/signUp');
const loginRoute = require('./routes/login')
const verifyRoute = require('./routes/verify')
const profileUpdatedDataRoute = require('./routes/profileUpdatedData')
const CheapflightsRoute = require('./routes/Cheapflights')

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());
// app.use(bodyParser.json());
app.use('/api/traveller', travellerRoutes);
app.use('/api/payment/order', PaymentOrderRoute);
app.use('/api/payment/Success', paymentSuccessRoute)
app.use('/api/SignUp', SignUpRoute)
app.use('/api/login', loginRoute)
app.use('/api/verify', verifyRoute)
app.use('/api/profileData', profileUpdatedDataRoute)
app.use('/api/flights/search', CheapflightsRoute)


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})