const DowHistory = require('../models/historyDowload');


const History = async(fileUrl , userid)=>{
  try{
   console.log(fileUrl)
    const history = await DowHistory.create({
      fileurl : fileUrl ,
      userId : userid
    })
    console.log(history);
  }catch(err){
    console.log(err);
  }
}

module.exports ={
     History,
}