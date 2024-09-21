import {singleUpdate, domainName, url,timeConverter, clickDailylogTd_timepicker, minuteConverter} from "./func.js"
let customer_array;
const add_new_button = document.getElementById("add_new_button");
const new_form = document.getElementById("new_form");
add_new_button.addEventListener("click",e=>{
    e.preventDefault();

    const requiredFields = new_form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
            // alert(1);
            Swal.fire({
                title: 'Warning!',
                text: `${field.name.replace(/\b[a-z]/g, (match) => match.toUpperCase())} is required.`,
                icon: 'warning',
                confirmButtonText: 'okay'
              });
            isValid = false;
        }
    });

    if (!isValid) return;  // If form is invalid, don't proceed
    // new_form.querySelectorAll("input, textarea").forEach(input=>{
    const formdata = new FormData(new_form);
    // console.log(formdata);
     const data = {};
    for (const [key, value] of formdata.entries()) {
        data[key] = value.trim();
    }

    fetch(url+"/api/daily_log/add_new", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(data => {
        console.log('Success:', data);
        if(data.status == "success"){
            M.toast({html: data.message, classes: 'rounded'});
            new_form.reset();
            M.Modal.getInstance(document.getElementById("main_modal")).close();
            loadDailyLogTable();
        }
        // Handle the response data here
    }).catch(error => {
        console.error('Error:',error);
        // Handle errors here
    });
   
});
const daily_log_table = document.getElementById("daily_log_table");

let formatTableData = () =>{
    const table = daily_log_table;
    const rows = table.querySelectorAll("tbody tr");
    let rowspan = {};
    rowspan["n"] = 1;
    let removetd = false;
    let totalTime = 0;
    for(let i = 0; i<rows.length;i++)
    {
        let current_row = rows[i], next_row = rows[i+1];
        current_row.cells[6].textContent = current_row.cells[5].textContent;

        // console.log(parseInt(current_row.cells[6].textContent.split(" ")[0])) 
        const a = parseInt(current_row.cells[6].textContent.split(" ")[0]);
        totalTime +=  isNaN(a)? 0:a;
        // console.log("Total Time",totalTime);
        if (removetd){
            current_row.cells[6].remove();
            rowspan.td.textContent =`${totalTime} min`;
        }
        if(i<rows.length-1){
        // console.log(rows[i].dataset.cid, rows[i+1].dataset.cid);
            

            if(current_row.dataset.cid  == next_row.dataset.cid){
                if(rowspan.n==1){
                    rowspan["td"]=current_row.cells[6];
                }
                rowspan.n ++;
                rowspan.td.rowSpan = rowspan.n;
                rowspan.td.textContent =`${totalTime} min`;
                removetd = true;
                
            }else{
                rowspan.n=1;
                removetd = false;
                totalTime = 0;
            }
            

        }
        
    }
}
let loadDailyLogTable = (offset=false)=>{
    if (offset==false){
        offset = localStorage.getItem("offset");
        if(offset == null){
            offset = 0;
        }
    }
    const data ={
        "offset": offset
    }
    fetch(url+"/api/daily_log/get", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(data => {
        const tbody = daily_log_table.querySelector("tbody");
        tbody.innerHTML = "";
        let offset = parseInt(localStorage.getItem('offset'))+1;
        data.forEach(row =>{
            // console.log(row)
            const tr = document.createElement("tr");
            tr.dataset.id= row.dl_id;
            tr.dataset.cid = row.customer_id;

            
            const td_date = document.createElement("td");
            td_date.textContent = row.date;
            tr.appendChild(td_date);

            const td_name = document.createElement("td");
            td_name.textContent = row.name;
            tr.appendChild(td_name);

            const td_address = document.createElement("td");
            td_address.textContent = row.address == "" ? "----" : row.address;
            tr.appendChild(td_address);

            const td_st = document.createElement("td");
            td_st.textContent = row.dl_start_time == null ? "----": timeConverter(row.dl_start_time);
            td_st.addEventListener("click",e=>clickDailylogTd_timepicker(e,"dl_start_time",row.dl_id));
            tr.appendChild(td_st);

            const td_et = document.createElement("td");
            td_et.textContent = row.dl_end_time == null ? "----": timeConverter(row.dl_end_time);
            td_et.addEventListener("click",e=>clickDailylogTd_timepicker(e,"dl_end_time",row.dl_id));
            tr.appendChild(td_et);

            const td_minutes = document.createElement("td");
            const minute = minuteConverter(row.dl_start_time,row.dl_end_time);
            // console.log(minute=="NaN")
            td_minutes.textContent = isNaN(minute)? "----" :`${minute} min` ;
            tr.appendChild(td_minutes);

            const td_total = document.createElement("td");
            td_total.textContent = "----";
            tr.appendChild(td_total);

            tbody.appendChild(tr);
            // console.log(tr)

        });
        formatTableData();
    }).catch(error => {
        console.error('Error:',error);
        // Handle errors here
    });
}

const dailyTimeLog_s = document.querySelectorAll(".dailyTimeLog");
dailyTimeLog_s.forEach(a=>{
    a.addEventListener("click",e=>{
        e.preventDefault();
        let offset = parseInt(localStorage.getItem('offset'))
        loadDailyLogTable(offset);
    });
});


const new_form_name = document.getElementById("new_form_name") ;
const loadCustomerdata= () =>{
    fetch(url+"/api/customer/get", {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        }
        // body: JSON.stringify(data)
    }).then(response => response.json()).then(data => {
        // console.log(data)
        customer_array = data;
        const a_customer = {}
        data.forEach(row=>{
            a_customer[row.name] = row.image;
        });
        var a_instances = M.Autocomplete.init(new_form_name, {
            data:a_customer,
            onAutocomplete: ()=>{
                // console.log(new_form_name.value)
                // alert(1)
                data.forEach(row=>{
                    if(row.name==new_form_name.value){
                        console.log(row);
                        
                        new_form_name.form.querySelectorAll("input,textarea").forEach(input=>{
                            for(const [key, value] of Object.entries(row)){
                                if(input.name==key && input!= new_form_name){
                                    input.value = value;
                                    if(input.tagName=="TEXTAREA") M.textareaAutoResize(input);
                                    }
                            }
                        })
                    }
                });
                M.updateTextFields();
            }
        });
        
    }).catch(error => {
        console.error('Error:',error);
        // Handle errors here
    });
}
const timepicker_h = document.getElementById("timepicker_h");
timepicker_h.addEventListener("input",e=>{
    console.log(e.target);
});

export{ loadDailyLogTable}