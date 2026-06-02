const express = require('express');
const mongoose = require('mongoose');
const Bike = require('./models/bike');
const Booking = require('./models/booking');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const {requireAuth,checkUser,requireOwner,requireRenter} = require('./middleware/authMiddleware'); 

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

app.use(checkUser,requireAuth, requireOwner);
 
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
//admin
app.get('/admin/bikes', requireAuth, requireOwner, async (req, res) => {
    try {
        const bikes = await Bike.find();
        res.render('admin/bikes', { bikes, user: req.user }); 
    } catch (err) {
        console.log(err);
    }
});

app.post('/admin/bikes/add', requireAuth, requireOwner, async (req, res) => {
    try {
        await Bike.create(req.body);
        res.redirect('/admin/bikes');
    } catch (err) {
        console.log(err);
    }
});

app.post('/admin/bikes/edit/:id', requireAuth, requireOwner, async (req, res) => {
    try {
        await Bike.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/bikes');
    } catch (err) {
        console.log(err);
    }
});

app.post('/admin/bikes/delete/:id', requireAuth, requireOwner, async (req, res) => {
    try {
        await Bike.findByIdAndDelete(req.params.id);
        res.redirect('/admin/bikes');
    } catch (err) {
        console.log(err);
    }
});

app.get('/admin/bookings', requireAuth, requireOwner, async (req, res) => {
    try {
        const bookings = await Booking.find().populate('userId').populate('bikeId');
        res.render('admin/bookings', { bookings, user: req.user });
    } catch (err) {
        console.log(err);
    }
});
app.post('/admin/bookings/delete/:id', requireAuth, requireOwner, async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.redirect('/admin/bookings');
    } catch (err) {
        console.log(err);
    }
});


//renter
app.get('/bikes', requireAuth,requireRenter, async (req, res) => {
    try {
        const bikes = await Bike.find();
        res.render('user/bikes', { bikes, user: req.user });
    } catch (err) {
        console.log(err);
    }
});

app.post('/booking', requireAuth,requireRenter, async (req, res) => {
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

app.get('/booking/:bikeId', requireAuth,requireRenter, async (req, res) => {
    try {
        const bikes = await Bike.findById(req.params.bikeId);
        const booking = await Booking.findOne({ bikeId: req.params.bikeId });
        res.render('user/booking', { bikes, booking, user: req.user });
    } catch (err) {
        console.log(err);
    }
});

app.get('/bookings', requireAuth, requireRenter, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('bikeId');
        res.render('user/history', { bookings, user: req.user });
    } catch (err) {
        console.log(err);
    }
});



//  404 
app.use((req, res) => {
    res.status(404).render('404');
});