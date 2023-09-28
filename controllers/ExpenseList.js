require('dotenv').config(); 
const Expenses = require("../models/expense");
const User = require("../models/user");
const DowHistory = require('./download_history');
const AWS = require('aws-sdk');
const Expense = require('../models/expense');
const {ObjectId} = require('mongodb')


function uploadToS3(data , filename){
 
 const BUCKET_NAME= process.env.BUCKET_NAME
 const IAM_USER_KEY= process.env.IAM_USER_KEY
 const IAM_USER_SECRET= process.env.IAM_USER_SECRET

 let s3bucket = new AWS.S3({
  accessKeyId : IAM_USER_KEY,
  secretAccessKey : IAM_USER_SECRET,
 })

  var params = {
     Bucket : BUCKET_NAME,
     Key : filename,
     Body : data ,
     ACL: 'public-read',
  }


  return new Promise ((resolve, reject)=>{
    s3bucket.upload(params , (err,s3response)=>{
      if(err){
        console.log('somiething went wrong' , err);
        reject(err);
        
      }else{
        // console.log('success' ,s3response);
        resolve(s3response.Location) ;
      }
      
  })
});
  
}





exports.downloadExpenses = async (req ,res)=>{
  try{
    const user = await User.findByPk(req.user.userId)
    const expenses = await user.getExpenses();
    const stringifyExpenses = JSON.stringify(expenses);
    const filename = `Expense${user.id}/${new Date()}.txt`;
     const fileUrl = await uploadToS3(stringifyExpenses, filename);
    //  console.log(fileUrl)
       DowHistory.History(fileUrl , user.id)
    res.status(200).json({fileUrl , success : true});
  }catch(err){
    res.status(500).json({fileUrl : '' , success : false});
  }
}



exports.getDetails = async (req, res, next) => {
  try {
    let data = await Expenses.find({userId: req.user });
    res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "user not able to create" });
  }
};



exports.postDetail = async (req, res, next) => {
  try {
    console.log(req.user);
    const { amount, description, category } = req.body; 

     req.user.totalExpenses =req.user.totalExpenses + parseInt(amount);
     req.user.save();
 
    const expense =  new Expenses({
      amount: amount,
      description: description,
      category: category,
      userId: req.user._id,
    });
    const result = await expense.save()
    console.log(result)
    res.status(201).json(expense); // Assuming you want to send the created user back
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};




exports.deletDetail = async (req, res, next) => {

  const listId = req.params.id;
  console.log(listId);
 
  try {
    const expense = await Expenses.findByIdAndDelete({_id : listId  });
     const id = expense.userId;
    const user =  await User.findById(id);
    user.totalExpenses  = user.totalExpenses - parseInt(expense.amount);
    user.save();
    return res.status(200).json({ message: "data deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error Deleting data" });
   }
};
exports.updateDetail = async (req, res, next) => {
  try {
 
  const listtId = req.params.id;
  let expense = await Expenses.updateByPk(listtId);
  const id = expense.userId;
  const user = User.findByPk(id);
  // actualy we don't need this for this time we also called the delete so that if we subtract at this time then in the delet this substract one more time then toalvalue make the coflict and it's create mesure issue;
  const expenseAmount = parseInt(expense.amount)
  let total = user.totalExpenses - expenseAmount ;
  user.update({totalExpenses : total})
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ err: "Error Updating data" });
  }
};

exports.getDetailsbyId = async (req, res) => {
  try {
    let listId = req.params.id;
      const expense = await Expenses.findByIdAndDelete({_id : listId  });
       const id = expense.userId;
      const user =  await User.findById(id);
      user.totalExpenses  = user.totalExpenses - parseInt(expense.amount);
      user.save();
      return res.status(200).json(expense);
    
  } catch (err) {
    res.status(500).json({ err: "Error getting data" });
  }
};



exports.getProducts = async ( req,res)=>{
  try{
  
   let Items_PER_PAGE = +req.query.row
   console.log(typeof(Items_PER_PAGE))

    const page = +req.query.page || 1;
    let totalItems ;
    let total = await Expense.count()
    totalItems = total;
    console.log(`page ==> ${page}`)
    const products = await Expense.findAll({
      offset :(page -1 ) * Items_PER_PAGE ,
      limit : Items_PER_PAGE,
    })
  //  console.log(products)
    res.status(200).json({
      products : products ,
      currentPage : page,
      hasNextpage : page< Math.ceil(totalItems/ Items_PER_PAGE) ,
      nextPage : page + 1,
      hasPreviousPage :  page > 1,
      PreviousPage : page - 1,
      lastPage : Math.ceil(totalItems/ Items_PER_PAGE),
    });
  }catch(err){
    res.status(500).json(err);
  }
}