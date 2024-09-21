import {singleUpdate, domainName, url,timeConverter, clickDailylogTd_timepicker, minuteConverter, converCustomerData} from "./func.js"


const searchCustomer = document.getElementById("searchCustomer");
searchCustomer.addEventListener("input",e=>{
    e.preventDefault();
    const input = e.target;
    // console.log(input.value)/
    let query = input.value.trim();
    loadAllcustomerTable(query);   
});

const loadAllcustomerTable = (query="") =>{
    const data = {query};
    // console.log(data)
      fetch(url+"/api/search/customer/all", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(data => {
        const convertedData = converCustomerData(data);

        // console.log('Success:', con);
        const collapsible_container= document.getElementById("collapsible_container");
        collapsible_container.innerHTML = "";
        convertedData.forEach(row => {
            // console.log(element);
            // Create the list item element
            const listItem = document.createElement('li');

            const collapsibleHeader = document.createElement('div');
            collapsibleHeader.classList.add('collapsible-header');

            const image = document.createElement('img');
            image.setAttribute('src', row.image);
            image.setAttribute('width', '30px');
            image.classList.add('responsive-img');
            image.style.marginRight = '1rem';

            const nameElement = document.createElement('span');
            nameElement.textContent = row.name;

            collapsibleHeader.appendChild(image);
            collapsibleHeader.appendChild(nameElement);

            // Create the collapsible body
                const collapsibleBody = document.createElement('div');
                collapsibleBody.classList.add('collapsible-body');

            // Create the content row
            const contentRow = document.createElement('div');
            contentRow.classList.add('row');

            // Create the address paragraph
            const addressParagraph = document.createElement('p');
            addressParagraph.innerHTML = `Address: ${row.address}
            <br/>Phone No: ${row.phone}
            <br/>Remark: ${row.remark}`;

            // Create the table element
            const table = document.createElement('table');
            table.classList.add('striped');

            // Create the table header
            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');

            const dateHeader = document.createElement('th');
            dateHeader.textContent   
            = 'Date';
            const minutesHeader = document.createElement('th');
            minutesHeader.textContent = 'Minutes';
            const subTotalHeader = document.createElement('th');
            subTotalHeader.textContent = 'Sub Total';

            headerRow.appendChild(dateHeader);
            headerRow.appendChild(minutesHeader);
            headerRow.appendChild(subTotalHeader);

            tableHeader.appendChild(headerRow);
            const tbody = {};
            // console.log(row.dl)
            row.dl.forEach(tr=>{
                if(!tbody.hasOwnProperty(tr.date)){
                    tbody[tr.date] = []
                }
                tbody[tr.date].push(minuteConverter(tr.dl_start_time,tr.dl_end_time));
            });
            // console.log(tbody)
            // Create the table body with data row
            const subTotal=[];
            const tableBody = document.createElement('tbody');
            for(let [key, value] of Object.entries(tbody)){
                const dataRow = document.createElement('tr');
                const dateCell = document.createElement('td');
                dateCell.textContent = key;
                const minutesCell = document.createElement('td');
                minutesCell.textContent = value.join(", ");
                const subTotalCell = document.createElement('td');
                const min = eval(value.join('+'));
                subTotalCell.textContent = `${min} Minutes` ;
                subTotal.push(min);
                dataRow.appendChild(dateCell);
                dataRow.appendChild(minutesCell);
                dataRow.appendChild(subTotalCell);
                tableBody.appendChild(dataRow);
            }




            // Create the table footer
            const tableFooter = document.createElement('tfoot');
            const footerRow = document.createElement('tr');

            const emptyCell = document.createElement('td');
            emptyCell.textContent = ''; // Optional: Add empty cell for visual consistency
            const totalFooter = document.createElement('th');
            totalFooter.textContent = 'Total';
            const totalMinutesCell = document.createElement('td');
            totalMinutesCell.textContent = `${eval(subTotal.join("+"))} Minutes`;

            footerRow.appendChild(emptyCell); // Optional
            footerRow.appendChild(totalFooter);
            footerRow.appendChild(totalMinutesCell);

            tableFooter.appendChild(footerRow);

            // Assemble the content
            contentRow.appendChild(addressParagraph);
            table.appendChild(tableHeader);
            table.appendChild(tableBody);
            table.appendChild(tableFooter);
            collapsibleBody.appendChild(contentRow);
            collapsibleBody.appendChild(table);

            // Append collapsible header and body to the list item
            listItem.appendChild(collapsibleHeader);
            listItem.appendChild(collapsibleBody);
            collapsible_container.appendChild(listItem)
        });
    }).catch(error => {
        console.error('Error:',error);
        return false;
        // Handle errors here
    });
}
const allCustomer_s= document.querySelectorAll("a.allCustomer.tabb");
allCustomer_s.forEach(a=>{
    a.addEventListener("click",e=>{
        e.preventDefault();
        loadAllcustomerTable();
    });
});