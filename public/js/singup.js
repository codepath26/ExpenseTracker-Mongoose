const username = document.getElementById('username')
const email = document.getElementById('email')
const password = document.getElementById('password')
const form = document.getElementById('signup-form')
const details = document.getElementById('details')
const alert1 = document.getElementById('alert1')
form.addEventListener('submit' , signUp)

async function signUp (e){

e.preventDefault();
  const obj = {
    name : username.value,
    email : email.value,
    password : password.value
  }
  try
  {
    let user = await axios.post(`http://localhost:3000/user/signup` , obj)
  
     username.value  = "";
     email.value = "";
     password.value = "" ;
     window.location.href = "../html/login.html"
    
    }catch(err){

      if(err.response.status === 403){
        alert1.style.display='block'
        setTimeout(() => {
          alert1.style.display="none"
        },2000);
        alert1.innerHTML = err.response.data.message
        console.log(err.response.data.message);
      }else{
        console.log(err);
      }
        
   
  }
}



