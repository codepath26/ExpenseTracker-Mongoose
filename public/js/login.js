// const { ConversationsMessageFileImageInfo } = require("sib-api-v3-sdk")

const email = document.getElementById('email')
const password = document.getElementById('password')
const form = document.getElementById('login-form')
const details = document.getElementById('details')
const alert1 = document.getElementById('alert1')
const forgotPass = document.getElementById('forgotPassword')
const urlParams = new URLSearchParams(window.location.search);
const data = urlParams.get('data');
if(data){
  console.log(data);
}


// eventListner
form.addEventListener('submit' , addData)
forgotPass.addEventListener('click',()=>window.location.href = '../html/forgotpass.html') 

async function addData (e){
  e.preventDefault();
  try{
let obj = {
  email : email.value,
  password : password.value
}
 
  let response = await axios.post('http://localhost:3000/user/login' , obj);
  console.log(response.data.user.isPremiumuser);
  localStorage.setItem("ispremium",response.data.user.isPremiumuser)

  const token = response.data.token;
  email.value = "",
  password.value = "" 
  localStorage.setItem('token' ,token);
  window.location.href = '../html/expenseList.html'
 
}catch(err){
   if(err.response){
        alert1.style.display = "block";
        alert1.innerHTML = err.response.data.message
      console.log(err.response.data.message);
   }
}
 } 






   



