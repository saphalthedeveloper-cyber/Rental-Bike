const User = require('../models/user');
const jwt = require('jsonwebtoken');
  const Bike = require('../models/bike');
    //handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { name: '', email: '', password: '' };
     //duplicate error code
    if (err.code === 11000) {
        errors.email = 'Email already registered';
        return errors;
    }
      //incorrect email
    if(err.message==='incorrect email'){
        errors.email='That Email is not registered'
    }
         //incorrect password
    if(err.message==='incorrect password'){
        errors.password='That password is not registered'
    }
   
    //validation error
    if (err.name === 'ValidationError') {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}
    //token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'saphal secret', {
        expiresIn: maxAge*1000
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup', { title: 'signup' })
}
module.exports.login_get = (req, res) => {
    res.render('login', { title: 'login' })
}

module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.create({ name, email, password });
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true })
        res.status(201).json({user:user._id});
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}
module.exports.login_post = async (req, res) => {
  const {email,password}=req.body;
  try{
    const user=await User.login(email,password);
     const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true })
    res.status(200).json({user:user._id})
  }
  catch(err){
    const errors = handleErrors(err)
    res.status(400).json({errors})
  }
}

module.exports.landing_get = async (req, res) => {
    try {
            const bikes = await Bike.find();
            res.render('index', { bikes, user: req.user,user:null});
        } catch (err) {
            console.log(err);
        }
    
}

module.exports.logout_get = async (req,res) => {
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/')
}