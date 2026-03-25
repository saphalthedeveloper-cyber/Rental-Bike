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

app.get('/',(req,res)=>{
    res.render('login',{title:'login'})
})
app.post('/',async(req,res)=>{
    try{
       const user = await User.findOne({email:req.body.email}) 
       if(!user){
        res.send('<script>alert("Email not found, please signup first"); window.location="/"</script>')
       }
       else if(user.password !==req.body.password){
        res.send('<script>alert("Wrong Password"); window.location="/"</script>')
       }
       else{
        res.redirect('/home')
       }
    }
      catch(err){
        console.log(err);
    }   
})
app.get('/signup',(req,res)=>{
    res.render('signup',{title:'signup'})
})
app.post('/signup',async(req,res)=>{
    try{
              const presentUser=await User.findOne({email:req.body.email})
    if(presentUser){
        return res.send('<script>alert("Email already exists! Please login"); window.location="/"</script>')
    }
          const user = new User(req.body)
    const users =await user.save()
    res.redirect('/')
    }
    catch(err){
        console.log(err);
    }
   
})
app.get('/home', async (req, res) => {
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
        const booking = await Booking.findOne({ bikeId: id });
            res.render('booking',{bike,booking});     
    }
    catch(err){
        console.log(err);
    }
});
app.post('/booking',async(req,res)=>{
    try{
          const booking=new Booking(req.body)
    const bookings = await booking.save()
    res.redirect(`/booking/${bookings.bikeId}`);
    }
    catch(err){
       console.log(err); 
    }
  
})
app.post('/booking/:id', async (req, res) => {
    const id = req.params.id; 
    await Booking.findByIdAndDelete(id);
    res.redirect('/home');
});
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
