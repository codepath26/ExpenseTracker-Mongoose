require('dotenv').config();
const mongoose = require("mongoose")
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require('path')
const port = process.env.PORT 

const expensesRoutes = require('./routes/expense')
const loginRoutes = require('./routes/login');
const ForgotPasswordRoutes = require('./routes/changePass');

const app = express()
app.use(bodyParser.json());   
app.use(cors());

app.use(loginRoutes);
app.use(expensesRoutes);
app.use('/password', ForgotPasswordRoutes);
app.use((req,res)=>{
  console.log(req.url)
  if(req.url === '/'){
    res.sendFile(path.join(__dirname , `public/index.html`))
  }else{

    console.log(path.join(__dirname , `public/${req.url}`))
    res.sendFile(path.join(__dirname,`public/${req.url}`))
  }
})
const dbURI = process.env.URI;
mongoose.connect(dbURI).then((result) => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});



