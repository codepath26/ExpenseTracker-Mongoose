const form = document.getElementById('forget-pasword')
const email = document.getElementById('email')
const showmes = document.getElementById('showmes')


//addevent listener

form.addEventListener('submit' , forgotPass);


//callback function

async function forgotPass(e){
  e.preventDefault();
  const obj = { 
    email : email.value ,
  }
  axios.post('http://localhost:3000/password/forgotpassword',obj).then(response => {
    if(response.status === 202){
       showmes.innerHTML += '<div style="color:red;">Mail Successfuly Sent <div>'
    } else {
        console.log("somthing went wrong")
    }
}).catch(err => {

    if(err.response.status === 500){
      showmes.innerHTML += `<div style="color:red;">${err.response.data.message} <div>`;
    
    }else{
      console.log(err)
    }
    
})
}