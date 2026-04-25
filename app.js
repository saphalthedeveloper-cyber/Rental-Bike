const express = require('express');
const mongoose = require('mongoose');
const Bike = require('./models/bike');
const Booking = require('./models/booking');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const {requireAuth} = require('./middleware/authMiddleware'); // ✅ no curly braces

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://bikerental:bikerental1234@cluster0.qmtffg3.mongodb.net/Bike-rental')
    .then(() => { app.listen(3000); })
    .catch((err) => console.log(err));


//  Public routes
app.use(authRoutes);

app.get('/home', requireAuth, async (req, res) => {
    try {
        const bikes = await Bike.find();
        res.render('index', { bikes, user: req.user});
    } catch (err) {
        console.log(err);
    }
});


app.get('/about', requireAuth, async (req, res) => {
    try {
        res.render('about', { user: req.user });
    } catch (err) {
        console.log(err);
    }
});

app.get('/bikes', requireAuth, async (req, res) => {
    try {
        const bikes = await Bike.find();
        res.render('bikes', { bikes, user: req.user });
    } catch (err) {
        console.log(err);
    }
});

app.get('/location', requireAuth, async (req, res) => {
    try {
        res.render('location', { user: req.user });
    } catch (err) {
        console.log(err);
    }
});

app.post('/booking', requireAuth, async (req, res) => {
    try {
        const booking = new Booking({
            ...req.body,
            userId: req.user._id
        });
        const bookings = await booking.save();
        await Bike.findByIdAndUpdate(bookings.bikeId, { isBooked: true });
        res.redirect(`/booking/${bookings.bikeId}`);
    } catch (err) {
        console.log(err);
    }
});

app.get('/booking/:bikeId', requireAuth, async (req, res) => {
    try {
        const bikes = await Bike.findById(req.params.bikeId);
        const booking = await Booking.findOne({ bikeId: req.params.bikeId });
        res.render('booking', { bikes, booking, user: req.user });
    } catch (err) {
        console.log(err);
    }
});

//  404 
app.use((req, res) => {
    res.status(404).render('404');
});