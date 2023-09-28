// window.addEventListener("DOMContentLoaded", fetchData);
// const btn1 = document.getElementById('btn1')
// const btn2 = document.getElementById('btn2')
// const btn3 = document.getElementById('btn3')
// const form = document.getElementById('rowperpage')
// const row = document.getElementById('row');
// form.addEventListener('submit', setrow)



// async function setrow(e){
//   e.preventDefault();
//   localStorage.setItem('row',row.value)
//   const rowpara = row.value;
//   try{
//     const page =1;
//     let res = await axios.get(`http://localhost:3000/products?page=${page}&row=${rowpara}`)
//     const {products , ...pagedata} = res.data;
//     listproduct(res.data.products);
//     showpagination(pagedata);
//   }catch(err){
//     console.log(err);

//   }
// }



// async function fetchData() {
//   const page =1;
//   try{
//     const rowpara = localStorage.getItem('row')
  
//     let res = await axios.get(`http://localhost:3000/products?page=${page}&row=${rowpara}`)
//     const {products , ...pagedata} = res.data;
//     listproduct(res.data.products);
//     showpagination(pagedata);
//   }catch(err){
//     console.log(err);
//   }
// }

// function listproduct(products) {
//   console.log(products)
//   const productListElement = document.getElementById("productList"); 
//   productListElement.innerHTML = "";
//   products.forEach((product) => {
//     productListElement.innerHTML +=  `<li class="list-group-item mt-2">Amount :${product.amount}, Description :${product.description}, Category : ${product.category}</li>`;
//   });
// }



// function showpagination ({
//   currentPage,
//   hasNextpage,
//   nextPage,
//   hasPreviousPage,
//   PreviousPage,
//   lastPage,
// }){
//   pagination.innerHTML = '';
//   if(hasPreviousPage){
//     const btn2 = document.createElement('button')
//     btn2.innerHTML = PreviousPage
//     btn2.classList = 'btn btn-success mx-2'
//     btn2.addEventListener('click' , ()=>getProducts(PreviousPage))
//     pagination.appendChild(btn2);
//   }
//   const btn1 = document.createElement('button')
//   btn1.innerHTML = `<h3>${currentPage}</h3>`
//   btn1.classList = 'btn btn-success  mx-2'
//   btn1.addEventListener('click' , ()=>getProducts(currentPage));
//   pagination.appendChild(btn1);
//   if(hasNextpage){
//     const btn3 = document.createElement('button')
//     btn3.innerHTML = nextPage
//     btn3.classList = 'btn btn-success mx-2'
//     btn3.addEventListener('click' , ()=>getProducts(nextPage))
//     pagination.appendChild(btn3);

//   };
// }


// async function getProducts(page){
//   const rowpara = localStorage.getItem('row');
//   console.log(`ropara==>${rowpara}`)
//   let res = await axios.get(`http://54.172.219.179
// :3000/products?page=${page}&row=${rowpara}`)
//   const {products , ...pagedata} = res.data;
//   listproduct(res.data.products);
//   showpagination(pagedata);

// }
  