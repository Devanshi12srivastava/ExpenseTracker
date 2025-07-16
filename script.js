let tForm= document.querySelector(".tform");
let allInput=tForm.querySelectorAll("input");
let selectEl=tForm.querySelector("select");
let btnEl=tForm.querySelectorAll("button");
let btnClose=document.querySelector(".btn-close");
let balance=document.querySelector(".balance");
let Expense=document.querySelector(".expense");
let Income=document.querySelector(".income");
let tablelist=document.querySelector(".tlist");
let editButton=document.querySelector(".editbtn");
const categoryEl = document.querySelector(".category-select2");

let transaction=[];

if(localStorage.getItem('transaction')!=null){
    transaction=JSON.parse(localStorage.getItem('transaction'));
}
console.log(transaction);
//transaction
function getCurrentBalance() {
  let totalcr = 0;
  let totaldr = 0;

  transaction.forEach((item) => {
    if (item.transaction === 'cr') totalcr += Number(item.amount);
    if (item.transaction === 'dr') totaldr += Number(item.amount);
  });

  return totalcr - totaldr;
}
tForm.onsubmit =(e)=>{
    e.preventDefault();
    let now=new Date();
    let obj={
        title: allInput[0].value,
        amount:allInput[1].value,
        transaction:selectEl.value,
         category: categoryEl.value,
        date:now,
        time:now.toLocaleTimeString('en-us',{
            hour:'numeric',
            minute:'2-digit',
            hour12:true
        })
    };


  // ❌ Prevent DR if balance is insufficient
 const currentbalance = getCurrentBalance(); // ✅ use balance-returning function

  if (obj.transaction === "dr" && obj.amount > currentbalance) {
    Swal.fire("⚠️ Not enough balance", "This expense exceeds your balance.", "warning");
    
  
  const modalElement = document.getElementById('myModel');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) {
    modalInstance.hide();
   
  }
   tForm.reset()
   return;
}
else{
    transaction.push(obj);
    console.log(transaction);
    localStorage.setItem('transaction',JSON.stringify(transaction));
Swal.fire("Success!", "Transaction added!", "success");
    btnClose.click();
    tForm.reset(); 
    showtransaction();
    calculateTransaction();
  }
}


const formateDate=(d)=>{
let date=new Date(d);
let yy=date.getFullYear();
let mm=date.getMonth()+1;
let dd=date.getDate();
mm = mm < 10? '0'+mm:mm;
dd= dd < 10? '0'+dd:dd;
return `${dd}-${mm}-${yy}`;
}

// delete
const deleteTrans = () => {
  let deleteBtn = tablelist.querySelectorAll(".btn-del");

  deleteBtn.forEach((btn, index) => {
    btn.onclick = () => {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success me-2",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });

      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // ✅ Ye line delete karegi item
          transaction.splice(index, 1);
          // ✅ localStorage update karega
          localStorage.setItem("transaction", JSON.stringify(transaction));
          // ✅ Dubara show karega table ko
          showtransaction();
          calculateTransaction();

          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Transaction has been deleted.",
            icon: "success"
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your transaction is safe 🙂",
            icon: "error"
          });
        }
      });
    };
  });
};


//update
const updateTrans=()=>{
let updateBtn = tablelist.querySelectorAll(".btn-edit");

updateBtn.forEach((btn, index) => {
    btn.onclick = () => {
        editButton.click();
        let title = btn.getAttribute("title");
        let amount = btn.getAttribute("amount");
        let trans = btn.getAttribute("transaction");

        selectEl.value = trans;
        allInput[0].value = title;
        allInput[1].value = amount;

        btnEl[0].classList.add("d-none");
        btnEl[1].classList.remove("d-none");

        btnEl[1].onclick = () => {
            let now = new Date();
            let obj = {
                title: allInput[0].value,
                amount: allInput[1].value,
                transaction: selectEl.value,
                category:categoryEl.value,
                
                date: now,
                time: now.toLocaleTimeString('en-us', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            };

            transaction[index]=obj;
            console.log(transaction);
            localStorage.setItem('transaction', JSON.stringify(transaction));
            
            Swal.fire("Success!", "Transaction Updated!", "success");
            btnClose.click();
          
            showtransaction();
            calculateTransaction(); 
            btnEl[0].classList.remove("d-none");
        btnEl[1].classList.add("d-none");
          tForm.reset(); 
        };
    };
});
}
const addBtn = document.querySelector(".editbtn");
addBtn.addEventListener("click", () => {
  // Reset input fields
  allInput[0].value = "";
  allInput[1].value = "";
  selectEl.value = "transaction";
  if (categoryEl) categoryEl.value = "";

  // Toggle buttons
  btnEl[0].classList.remove("d-none"); // show submit
  btnEl[1].classList.add("d-none");    // hide update

  // Remove any previously set update onclick
  btnEl[1].onclick = null;

  // Reset form completely (just in case)
  tForm.reset();
});

//date

const tarik=document.querySelector(".filter");
tarik.addEventListener("click",function filterDate(){
  const selectedDate=document.getElementById("filter-date").value;
  if(!selectedDate){
    alert("please Enter a Date ☹️");
    return;
  }
  const allTransaction= JSON.parse(localStorage.getItem("transaction")) || [];
  const dateFilter = allTransaction.filter(item=>{
    const transDate=new Date(item.date).toISOString().split('T')[0];
    
    return transDate === selectedDate;
    
    })
   if (dateFilter.length === 0) {
  alert("No transactions found on this date.");
} 
  showtransaction(dateFilter); 
}
)


// show the transaction
const showtransaction=()=>{
    tablelist.innerHTML="";
    transaction.forEach((item,index)=>{
       
tablelist.innerHTML+=`<tr>
                  <td>${item.title}</td>
                   <td>${item.category}</td>
                   <td>${item.amount}</td>
                   <td>${item.transaction}</td>
                  <td>${formateDate(item.date)}</td>
                  <td>${item.time}</td>
                 
                
                  <td>
                 <button title=${item.title} category=${item.category} amount=${item.amount} transaction=${item.transaction} class=" btn-edit btn btn-outline-success btn-sm me-2"><i class="fa-solid fa-pen "></i></button>
                <button class=" btn-del btn btn-outline-danger btn-sm"><i class="fa-solid fa-trash"></i> </button>
                </td>
                </tr>`;
    });
    deleteTrans();
    updateTrans();
}
showtransaction();

// calculation

const calculateTransaction=()=>{
    //credit
    let totalcr=0;
const filterCredit=transaction.filter((item)=>item.transaction ==='cr');
for(let obj of filterCredit){
    totalcr += Number(obj.amount);
}
console.log(totalcr);
//debit
let totaldr=0;
const filterDebit=transaction.filter((item)=>item.transaction ==='dr');
for(let obj of filterDebit){
    totaldr += Number(obj.amount);
}
console.log(totaldr);
Income.innerText=totalcr;
Expense.innerText=totaldr;
const totalBalance=totalcr-totaldr;
console.log(totalBalance);  
  balance.innerText = totalBalance;
  
  }

calculateTransaction();



