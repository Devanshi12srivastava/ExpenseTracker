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
const categoryEl2=document.querySelector(".category-select");
const resetBtn=document.querySelector(".reset");
const restoreBtn = document.querySelector(".restore");

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
     renderMonthlyChart();    
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
  renderMonthlyChart();
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
        let category1 = btn.getAttribute("category");

        selectEl.value = trans;
        allInput[0].value = title;
        allInput[1].value = amount;
       categoryEl.value = category1;

        btnEl[0].classList.add("d-none");
        btnEl[1].classList.remove("d-none");

        btnEl[1].onclick = () => {
            let now = new Date();
            let obj = {
                title: allInput[0].value,
                amount: allInput[1].value,
                transaction: selectEl.value,
                   category: categoryEl.value,
                date: now,
                time: now.toLocaleTimeString('en-us', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            };
   const currentbalance = getCurrentBalance();

    if (obj.transaction === "dr" && obj.amount > currentbalance) {
        Swal.fire("⚠️ Not enough balance", "This expense exceeds your balance.", "warning");
        
        const modalElement = document.getElementById('myModel');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();

        tForm.reset();
        return;
    }
            transaction[index]=obj;
            console.log(transaction);
            localStorage.setItem('transaction', JSON.stringify(transaction));
            
            Swal.fire("Success!", "Transaction Updated!", "success");
            btnClose.click();
            tForm.reset();
            showtransaction();
            calculateTransaction(); 
            btnEl[0].classList.remove("d-none");
        btnEl[1].classList.add("d-none");
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

const tarik = document.querySelector(".filter");

tarik.addEventListener("click", function filterDate() {
  const selectedDate = document.getElementById("filter-date").value;

  if (!selectedDate) {
    alert("Please enter a date ☹️");
    return;
  }

  const allTransaction = JSON.parse(localStorage.getItem("transaction")) || [];

  const dateFilter = allTransaction.filter(item => {
  const transDate = new Date(item.date).toLocaleDateString('en-CA');
    return transDate === selectedDate;
  });

  if (dateFilter.length === 0) {
    alert("No transactions found on this date.");
  }

  if (typeof showtransaction === "function") {
    showtransaction(dateFilter);
  } else {
    console.error("⚠️ showtransaction function is not defined.");
  }
});


//category wise filter
categoryEl2.addEventListener("change",function category(){
const chooseCategory = categoryEl2.value;
  const Transaction2 =JSON.parse(localStorage.getItem("transaction")) || [];

   if (!chooseCategory) {
    showtransaction(Transaction2); // agar kuch select nahi kiya to sab dikhaye
    return;
  }
  const selectcategory = Transaction2.filter(item=> item.category === chooseCategory);
console.log(selectcategory);
  if(selectcategory.length==0){
    alert("no transaction found");
  }
     showtransaction(selectcategory);
  });


// show the transaction
const showtransaction=(data = transaction)=>{
    tablelist.innerHTML="";
    data.forEach((item,index)=>{
       
tablelist.innerHTML+=`<tr>
                  <td>${item.title}</td>
                   <td>${item.category}</td>
                   <td>${"₹"+item.amount}</td>
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
renderMonthlyChart();


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
Income.innerText= "₹"+totalcr;
Expense.innerText="₹"+totaldr;
const totalBalance=totalcr-totaldr;
console.log(totalBalance);  
  balance.innerText = "₹"+totalBalance;
  
  }

calculateTransaction();

resetBtn.addEventListener("click", function(){
  const oldData = localStorage.getItem("transaction");
  if (oldData) {
    localStorage.setItem("transaction_backup", oldData); // 🗃️ backup save
  }

  localStorage.removeItem("transaction"); // ❌ delete main data
  transaction = [];

  tablelist.innerHTML=`<div class="text-center p-4 bg-light rounded shadow-sm">
    <h5 class="text-muted">No data yet!</h5>
    <p class="text-secondary">Start by adding your first transaction.</p>
  </div>`;
  Income.innerHTML="0";
  Expense.innerHTML="0";
  balance.innerHTML="0";
 

  if (window.myChart) {
    window.myChart.destroy();
    window.myChart = null;
  }
});
  
  

restoreBtn.addEventListener("click", () => {
  const backup = localStorage.getItem("transaction_backup");
  if (backup) {
    localStorage.setItem("transaction", backup); // 🔁 restore original
    transaction = JSON.parse(backup);
    showtransaction();
    calculateTransaction();
    renderMonthlyChart();

    Swal.fire("✔️ Restored!", "Your previous transactions are back!", "success");
  } else {
    Swal.fire("⚠️ No Backup Found", "There's nothing to restore.", "warning");
  }
});



function getMonthlySummary() {
  const transactionData = JSON.parse(localStorage.getItem("transaction")) || [];

  const summary = {}; // { '2025-07': { cr: 0, dr: 0 }, ... }

  transactionData.forEach(item => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!summary[monthKey]) {
      summary[monthKey] = { cr: 0, dr: 0 };
    }

    if (item.transaction === "cr") {
      summary[monthKey].cr += parseFloat(item.amount);
    } else {
      summary[monthKey].dr += parseFloat(item.amount);
    }
  });

  return summary;
}
function getMonthlySummary() {
  const transactionData = JSON.parse(localStorage.getItem("transaction")) || [];

  const summary = {};

  transactionData.forEach(item => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!summary[monthKey]) {
      summary[monthKey] = { cr: 0, dr: 0 };
    }

    if (item.transaction === "cr") {
      summary[monthKey].cr += parseFloat(item.amount);
    } else {
      summary[monthKey].dr += parseFloat(item.amount);
    }
  });

  return summary;
}

function renderMonthlyChart() {
  const summary = getMonthlySummary();
  const labels = Object.keys(summary).sort();  // optional: sort months
  const incomeData = labels.map(month => summary[month].cr);
  const expenseData = labels.map(month => summary[month].dr);

  const ctx = document.getElementById('monthlyChart').getContext('2d');

  // ✅ Destroy old chart instance if it exists
  if (window.myChart) {
    window.myChart.destroy();
  }

  // ✅ Create new chart and assign to global
  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Income',
          backgroundColor: '#28a745',
          data: incomeData
        },
        {
          label: 'Expense',
          backgroundColor: '#dc3545',
          data: expenseData
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


