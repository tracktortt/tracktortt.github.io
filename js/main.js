document.querySelectorAll('.tabb').forEach(button=>{
    button.addEventListener("click",e=>{
        e.preventDefault();
        const a = e.target;
        // console.log(a.dataset.id)
        const element = document.getElementById(a.dataset.id);

        if (element !== null) {
        // Element exists
        document.querySelectorAll(".tabe").forEach(div=>{div.style.display = "none";});
        element.style.display = "block";
        const a = document.querySelector(".sidenav-overlay");
        if(a!==null)a.click();
        // console.log('Element found!');
        } else {
        // Element does not exist
        // console.log('Element not found.');
        }
    });
});