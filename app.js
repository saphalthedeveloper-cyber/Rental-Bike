const  express=require('express');
const mongoose = require('mongoose');
const User=require('./models/user');
const Bike = require('./models/bike');
const Booking = require('./models/booking');

const authRoutes=require('./routes/authRoutes')

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

mongoose.connect('mongodb+srv://bikerental:bikerental1234@cluster0.qmtffg3.mongodb.net/Bike-rental')
.then(()=>{
    app.listen(3000)}) 
.catch((err)=>console.log(err));



app.get('/home/:id', async (req, res) => {
    try{
        const id=req.params.id;
        const user = await User.findById(id);
        const bikes = await Bike.find();       
        res.render('index', { bikes, user });      
    }
    catch(err){
        console.log(err);
    }   
});
app.get('/about/:id',async (req, res) => {
     try{
        const id=req.params.id;
        const user=await User.findById(id) ;
            res.render('about',{user});     
    }
    catch(err){
        console.log(err);
    }
});

app.post('/booking',async(req,res)=>{
    try{
    const booking=new Booking(req.body)
    const bookings = await booking.save()
    await Bike.findByIdAndUpdate(bookings.bikeId, { isBooked: true });
    res.redirect(`/booking/${req.body.userId}/${bookings.bikeId}`)
    }
    catch(err){
       console.log(err); 
    } 
})
app.get('/booking/:userId/:bikeId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const bikes = await Bike.findById(req.params.bikeId);
        const booking = await Booking.findOne({ bikeId: req.params.bikeId });
        res.render('booking', { bikes, booking, user });
    } catch (err) {
        console.log(err);
    }
});






app.get('/bikes/:id', async (req, res) => {
    try{
        const id=req.params.id;
        const user=await User.findById(id) ;
        const bikes = await Bike.find();
        res.render('bikes',{bikes,user}); 
    }
    catch(err){
        console.log(err);
    }   
});

app.get('/location/:id',async (req, res) => {
         try{
        const id=req.params.id;
        const user=await User.findById(id) ;
            res.render('location',{user});     
    }
    catch(err){
        console.log(err);
    } 
});

app.use(authRoutes);

app.use( (req, res) => {
    res.status(404).render('404'); 
});

