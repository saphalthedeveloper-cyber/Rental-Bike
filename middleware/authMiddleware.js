const jwt=require('jsonwebtoken');
const User = require('../models/user');

const requireAuth=(req,res,next)=>{
    const token=req.cookies.jwt;
    if(token){
        jwt.verify(token,'saphal secret',async(err,decodedToken)=>{
            if(err){
          
               res.redirect('/');
            }
            else{
               
                req.user = await User.findById(decodedToken.id);
                
                next();
            }
        })    
    }
       else{
            res.redirect('/')
        }
}

const requireOwner = (req, res, next) => {
    if (req.user && req.user.role === 'owner') {
        next();
    } else {
        res.status(403).render('404');
    }
}


const requireRenter = (req, res, next) => {
    if (req.user && req.user.role === 'renter') {
        next();
    } else {
        res.status(403).render('404');
    }
}




const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'saphal secret', async (err, decodedToken) => {
      if (err) {
       
        res.locals.user = null;
        next();
      } else {
       
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, requireOwner, requireRenter };
