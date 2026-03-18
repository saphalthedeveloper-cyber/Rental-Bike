const  express=require('express');
const mongoose = require('mongoose');
const Bike = require('./models/bike');
const Booking = require('./models/booking');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://bikerental:bikerental1234@cluster0.qmtffg3.mongodb.net/Bike-rental')
.then(()=>{
    app.listen(3000)}) 
.catch((err)=>console.log(err));


app.get('/', async (req, res) => {
    try{
        const bikes = await Bike.find();
        res.render('index',{bikes}); 
    }
    catch(err){
        console.log(err);
    }   
});


app.get('/about', (req, res) => {
    res.render('about'); 
});
app.get('/booking/:id',async (req, res) => {
    try{
        const id=req.params.id;
        const bike=await Bike.findById(id);
            res.render('booking',{bike});     
    }
    catch(err){
        console.log(err);
    }
});
app.post('/booking',async(req,res)=>{
    try{
          const booking=new Booking(req.body)
    const bookings = await booking.save()
    res.redirect('/');
    }
    catch(err){
       console.log(err); 
    }
  
})
app.get('/bikes', async (req, res) => {
    try{
        const bikes = await Bike.find();
        res.render('bikes',{bikes}); 
    }
    catch(err){
        console.log(err);
    }   
});

app.get('/location', (req, res) => {
    res.render('location'); 
});
app.use( (req, res) => {
    res.status(404).render('404'); 
});
