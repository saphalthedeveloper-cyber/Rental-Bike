const jwt=require('jsonwebtoken')
const User = require('../models/user');

const requireAuth=(req,res,next)=>{
    const token=req.cookies.jwt;
    //check json web token exits & is verified
    if(token){
        jwt.verify(token,'saphal secret',async(err,decodedToken)=>{
            if(err){
               console.log(err.message);
               res.redirect('/');
            }
            else{
                console.log(decodedToken);
                req.user = await User.findById(decodedToken.id);
                 console.log('User:', req.user);
                next();
            }
        })    
    }
       else{
            res.redirect('/')
        }
}

module.exports={requireAuth}
