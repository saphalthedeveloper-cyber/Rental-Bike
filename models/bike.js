const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const bikeSchema= new Schema({
    name:String,
    color:String,
    image:String,
    contact:Number,
    pricePerDay:Number,,
   
},{timestamps:true,collection:'bikes'});

module.exports=mongoose.model('Bike',bikeSchema);

