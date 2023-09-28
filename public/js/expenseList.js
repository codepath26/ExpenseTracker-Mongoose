
const amount = document.getElementById("ExpenseAmount");
const description = document.getElementById("Description");
const showLeaderBoard = document.getElementById("leaderBoard");
const paybutton = document.getElementById("getpremium");
const category = document.getElementById("Category");
const addExpense = document.getElementById("add-items");
const feature1 = document.getElementById("leaderborditem");
const isPremiumuser = document.getElementById("premiumUser");
const items = document.getElementById("items");
const download = document.getElementById('download')


// evente Listner
paybutton.addEventListener("click", payment);
addExpense.addEventListener("submit", addExpenses);
showLeaderBoard.addEventListener("click", leaderBoard);
items.addEventListener("click", modified);
window.addEventListener("DOMContentLoaded", fetchData);
download.addEventListener('click' ,  downloadExpenses)

// DomContent Loaded

async function fetchData() {
  try {
  
    let token = localStorage.getItem("token");
    let ispremium = localStorage.getItem("ispremium");
    console.log(ispremium)
    if (ispremium === 'false' || !ispremium) {
      console.log("this is it")
      showLeaderBoard.style.display = "none";
      download.style.display = "none";
    } else {
      isPremiumuser.style.display = "block";
      paybutton.style.display = "none";
      download.style.display = "block";
    }
    
    let response = await axios.get("http://localhost:3000/expenseDetails", {
      headers: { Authorization: token },
    });
    console.log(response)
    if(response.data.length > 0){
      response.data.forEach((obj) => {
        DisplayData(obj);
      });
    }
    
  } catch (err) {
    console.log(err.status , "this is the error");
  }
}


// adding the Data to DOM and Database

async function addExpenses(e) {
  e.preventDefault();    // why we use this ?????? behind the sence
  const obj = {
    amount: amount.value,
    description: description.value,
    category: category.value,
  };

  try {
    let token = localStorage.getItem("token");
    let response = await axios.post(
      "http://localhost:3000/expenseDetails",
      obj,
      {
        headers: {

           Authorization: token,

          },
      }
    );
    DisplayData(response.data);
    amount.value = "";
    description.value = "";
    category.value = "Movies";
  }
  catch (err) {
    console.log(err);
  }
}


// adding the functionality of the edit and delete button 

async function modified(e) {
  e.preventDefault();

  if (e.target.classList.contains("delete")) {
    let li = e.target.parentElement;
    const id = li.querySelector("#userid").value;
  
    try { 
     const response =  await axios.delete(`http://localhost:3000/expenseDetails/${id}`);
     console.log(response.data.message);
      items.removeChild(li);
    } catch (err) {
      console.log(err);
    }
  }
  if (e.target.classList.contains("edit")) {
    let li = e.target.parentElement;
    const id = li.querySelector("#userid").value;
    try {
      let response = await axios.get(
        `http://localhost:3000/expenseDetails/${id}`
      );
      console.log(response);
      amount.value = response.data.amount;
      description.value = response.data.description;
      category.value = response.data.category;
      items.removeChild(li);
  
    } catch (err) {
      console.log(err);
    }
  }
}


//disolay the getting data to the DOM


function DisplayData(obj) {
 console.log('here')
  items.innerHTML += `<li class="list-group-item mt-2">Amount :${obj.amount}, Description :${obj.description}, Category : ${obj.category}<button class="btn btn-success btn-sm mx-1 edit float-end">Edit</button><button class="btn btn-danger btn-sm float-end delete mx-1">Delete</button><input type="hidden" name="userid" id="userid" value="${obj._id}"></li>`;
}





async function payment(e) {
  try {
    let token = localStorage.getItem("token");
    let response = await axios.get(
      "http://localhost:3000/premium/getPremiumMemberShip",
      {
        headers: { Authorization: token },
      }
    );

    let options = {
      key: response.data.key_id,
      order_id: response.data.order.orderId,
      handler: async function (response) {
        try {
          await axios.post(
            `http://localhost:3000/premium/updatetransactionstatus`,
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { Authorization: token } }
          );
          alert("you are premium user now");
          localStorage.setItem("ispremium", true);
          isPremiumuser.style.display = "block";
          paybutton.style.display = "none";
          showLeaderBoard.style.display = "block";
          download.style.display = "block";
        } catch (err) {
          console.log(err.message, "thisss");
        }
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on("payment.failed", function (response) {
 
      alert("something went wrong");
    });
  } catch (err) {
    console.log(err.message);
  }
}

// show the leader board

async function leaderBoard() {
  let response = await axios.get(
    "http://localhost:3000/premium/leaderBoard"
  );
  feature1.style.display = "block";
  feature1.innerHTML += `<h2><b>Leader Board<b>`
  response.data.forEach((obj) => {
    feature1.innerHTML += `<li class='list-group-item mt-2'> Name :- ${obj.name} and TotalCost:- ${obj.totalExpenses ? obj.totalExpenses : 0} </li>`;
  });
  setTimeout(() => {
    feature1.innerHTML = ""
    feature1.style.display = "none";
  }, 3000);
}




async function downloadExpenses (e){
  try{

    let token = localStorage.getItem("token");
    let response = await axios.get('http://localhost:3000/download',{
      headers: { Authorization: token}
    })
  if(response.status === 200){
    const a = document.createElement('a');
    a.href = response.data.fileUrl;
    a.download = 'myexpense.csv'
    a.click();
  }else{
    throw new  Error (response.data.message)
  }



  }catch(err){
    console.log(err);
  }
  
}




