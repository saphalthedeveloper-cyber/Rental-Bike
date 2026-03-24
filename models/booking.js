const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const bookingSchema=new Schema({
    name:String,
    phone:String,
    bikeName:String,
    fromDate:Date,
    toDate:Date,
    pricePerDay:String,
},{timestamps:true})

module.exports=mongoose.model('Booking',bookingSchema);
