require('dotenv').config(); 
const jwt = require("jsonwebtoken");
const  Razorpay  = require('razorpay');
const Order = require("../models/order");
const Expenses = require("../models/expense");
const User = require("../models/user");




exports.getPremium = async (req, res)=>{
  try{

    const payuser=req.user;
    const rzp = new Razorpay({
      key_id : process.env.RAZORPAY_KEY_ID,
      key_secret :  process.env.RAZORPAY_KEY_SECRET,
    })
    
    const  amount = 250;
    
 try{
   const order =   await  rzp.orders.create({amount , currency : "INR"})
   console.log("this is required")
   const newOreder =   new Order({
        paymentId : 'this',
        orderId: order.id,
        status: 'PANDING',
        userId: payuser.id, 
   });
   try{

     const order1 =  await  newOreder.save();
     console.log(order1)
    }catch(err){
      console.log(err);
    }

   return res.status(201).json({ order:  newOreder, key_id: rzp.key_id });
  }catch(err){
    console.log('Razorepay API error' , err);
    return res.status(500).json({ message: "Error creating order" });;
  }
}
  catch(err){
    console.error("Internal server error:", err);
    res.status(500).json({ message: 'internal in Razorpay Api call' });
  }
};





exports.updateTransactionStatus =async (req ,res)=>{
  try{
    const payuser = req.user
    console.log("payuser",payuser)
    const {order_id ,payment_id} = req.body;
   let order = await Order.findOne({orderId : order_id})
   console.log(order);
   order.paymentId = payment_id;
   order.status = "SUCCESSFUL";
   await order.save();
   payuser.isPremiumuser  = true;
   await payuser.save();
   console.log("At the end of payment")
   return res.status(202).json({success : true ,message : "Transection Successful" })

  }catch(err){
    console.log(err);
    return res.status(500).json({message : "internal server error"})
  }
}




exports.getfeature =async(req,res)=>{

try{
  const leaderBoard = await User.aggregate([
    {
      $lookup: {
        from: 'expenses', // Assuming your Expenses collection is named 'expenses'
        localField: '_id',
        foreignField: 'userId', // Assuming there's a 'userId' field in Expenses referencing User
        as: 'expenses',
      },
    },
    {
      $group: {
        _id: '$_id',
        name: {$first : '$name'} ,
        totalExpenses:{$sum : '$totalExpenses'}// Adjust this field according to your Expenses schema
      },
    },
    {
      $sort: { totalExpenses: -1 },
    },
  ]);
  
  console.log(leaderBoard);
  
  
  res.status(200).json(leaderBoard);
}catch(err){
  console.log(err);
  res.status(500).json(err)
}
}
