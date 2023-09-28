require("dotenv").config();
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Forgotpassword = require("../models/forgotpass");
const Brevo = require("sib-api-v3-sdk");

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.EMAIL_API_KEY;
console.log(process.env.EMAIL_API_KEY);
const apiInstance = new Brevo.TransactionalEmailsApi();

exports.forgotpassword = async (req, res) => {
  try {
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
   
    const { email } = req.body;
    const user = await User.findOne({ email :  email  });
    console.log(user);
    if (user) {
      const id = uuid.v4();
      console.log(id);
      const forgotePass = new  Forgotpassword ({
        id : id,
        active : true,
        expiresby : new Date() ,
        userId : user._id,
      })
      const fpass = await forgotePass.save();
      console.log(id);
      console.log(email);
     const data = await apiInstance.sendTransacEmail(
      {
          sender: { email: "parththakor2610@gmail.com", name: "Parth" },
          subject: "To forgote you passoword",
          htmlContent: `<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p><a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a></body></html>`,

          to: [
            {
              email: `${email}`,
              name: "Rohan",
            },
          ],
        }
        );
       
          return res.status(202).json({
              message: "Link to reset password sent to your mail ",
              sucess: true,
            });
          

    } 
    else
     {
      console.log("here2");
      res.status(500).json({ message: "Please Enter The Correct Email" });
    }
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  } 
  catch (err)
 {
    console.log("here3");
    res.status(500).json(err);
  }
};

exports.resetpassword = async (req, res) => {
  try{

      const id = req.params.id;
      
     const forgotpasswordrequest =  await Forgotpassword.findOne( { id  : id})
          console.log("request",forgotpasswordrequest);
          if (forgotpasswordrequest) {
              forgotpasswordrequest.active =  false;
              await forgotpasswordrequest.save();
              res.status(200).send(`<html>
              <script>
              function formsubmitted(e){
                  e.preventDefault();
                  console.log('called')
                }
                </script>
                
                <form action="/password/updatepassword/${id}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>reset password</button>
                </form>
                </html>`);
                res.end();
            }
        }
    catch(err){
        res.status(500).json({message : "something went wrong"})
    }
};

exports.updatepassword =async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    console.log("resdidi===>",resetpasswordid);
    const resetpasswordrequest = await  Forgotpassword.findOne({id: resetpasswordid})
     const user = await User.findOne( { _id: resetpasswordrequest.userId })
          console.log('userDetails', user)
          if (user) {
            //encrypt the password
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function (err, salt) {
              if (err) {
                
                  console.log(err);
                  throw new Error(err);
                }
                bcrypt.hash(newpassword, salt,async function (err, hash) {
                  // Store hash in your password DB.
                  if (err) {
                    console.log(err);
                    throw new Error(err);
                  }
                  user.password = hash
                  await user.save();
                 
                  res.redirect(`http://localhost:3000/html/login.html`);
                    // res.status(201).json({ message: "Successfuly update the new password" });
                  });
                });
            } else {
              return res.status(404).json({ error: "No user Exists", success: false });
            }
          
  }catch (error) {
    return res.status(403).json({ error, success: false });
}
}
