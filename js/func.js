import { loadDailyLogTable} from "./daily_log.js"
const domainName = window.location.hostname;
const url = `http://${domainName}:5000`

const singleUpdate = async (id,value,field) =>{
   const data = {id,value,field}
    // console.log(data)
      fetch(url+"/api/daily_log/set", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(data => {
        console.log('Success:', data);
        if(data.status == "success"){
            // M.toast({html: data.message, classes: 'rounded'});
            loadDailyLogTable();
            return true;
        }
        // Handle the response data here
    }).catch(error => {
        console.error('Error:',error);
        return false;
        // Handle errors here
    });
}

let timeConverter = (timestr) =>{
    let hour = timestr.split(":")[0]
    const minute = timestr.split(":")[1]
    // const secound = timestr.split(":")[2]
    let amOrPm = "AM";
    if (hour>12) {
        amOrPm = "PM";
        hour  = hour %12;
    }
    return `${hour}:${minute} ${amOrPm}`
}

const clickDailylogTd_timepicker = (e,fieldName,dl_id) =>{

    e.preventDefault();
    // console.log(e.target)
    const td = e.target;
    const id = td.parentElement.dataset.id;
    // console.log(id)
    const hiddenInput = document.getElementById("timepicker_h");
    
    const timePickerInstance = M.Timepicker.init(hiddenInput, {
        onCloseEnd: function() {
          // Retrieve the Timepicker instance again within the callback
          const instance = M.Timepicker.getInstance(hiddenInput);
          
          // Get the selected time
          const selectedTime = instance.time;
          const amOrPm = instance.amOrPm; 
        //   console.log('Selected Time:', selectedTime, amOrPm, row.dl_id);
          if(selectedTime!=undefined){
            singleUpdate(dl_id,`${selectedTime} ${amOrPm}`,fieldName);
          }
          instance.destroy();
          hiddenInput.value = "";
        // instance.destroy();
        }
      });

    timePickerInstance.open();
   
}

const minuteConverter=(startTime,endTime)=>{
     // Convert start time and end time into Date objects on the same day
     let startDate = new Date(`1970-01-01T${startTime}`);
     let endDate = new Date(`1970-01-01T${endTime}`);
 
     // If the end time is earlier than the start time, return 0 as no crossing to the next day is considered
     if (endDate < startDate) {
         return 0; // or handle it as needed
     }
 
     // Calculate the difference in milliseconds
     let diffInMs = endDate - startDate;
 
     // Convert milliseconds to minutes
     let diffInMinutes = diffInMs / (1000 * 60);
     
     return diffInMinutes;
}


const converCustomerData = (data) => {
  const result = [];

  data.forEach(item => {
    // Find if the customer already exists in the result
    let customer = result.find(c => c.customer_id === item.customer_id);

    // If not found, create a new customer entry
    if (!customer) {
      customer = {
        customer_id: item.customer_id,
        name: item.name,
        address: item.address,
        image: item.image,
        phone: item.phone,
        remark: item.remark,
        dl: []
      };
      result.push(customer);
    }

    // Add the dl (delivery) data to the customer's dl array
    customer.dl.push({
      dl_id: item.dl_id,
      date: item.date,
      dl_start_time: item.dl_start_time,
      dl_end_time: item.dl_end_time
    });
  });

  return result;
};
export {singleUpdate,domainName,url, timeConverter, clickDailylogTd_timepicker,minuteConverter, converCustomerData}