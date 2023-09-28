const express = require('express')
const useController = require('../controllers/ExpenseList')
const router = express.Router();
const auth = require('../authentication/auth');
const premiumCon = require('../controllers/premiumFeatures')


router.get('/expenseDetails',auth.authenticateUser,useController.getDetails)
router.get('/expenseDetails/:id',useController.getDetailsbyId)
router.post('/expenseDetails' ,auth.authenticateUser, useController.postDetail)
router.delete('/expenseDetails/:id' , useController.deletDetail)
router.put('/expenseDetails/:id' , useController.updateDetail)
// // router.get('/appointmentDetailbyId',useController.getDetailbyId)
router.get('/premium/getPremiumMemberShip',auth.authenticateUser,premiumCon.getPremium)
router.get('/premium/leaderBoard',premiumCon.getfeature)
router.post('/premium/updatetransactionstatus',auth.authenticateUser,premiumCon.updateTransactionStatus)

// router.get('/download',auth.authenticateUser,useController.downloadExpenses)
// router.get('/products' , useController.getProducts);



module.exports = router;



//why we need authentication at this point if not the how i get the perticuler user to increse the total in database??