// CODE EXPLAINED channel

//Selecting elements
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const addButton = document.querySelector('.fa-plus-circle');

//Classes names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

//Variables
let LIST, id;

//Get things from local storage
let data = localStorage.getItem("TODO");

//Check if data is not empty
if(data){
    LIST = JSON.parse(data);
    if (Array.isArray(LIST)) { // Check if LIST is a valid array
        id = LIST.length; //set the id to the last item in the list
        loadList(LIST); //load the list to the user interface
    } else {
        LIST = []; // If LIST is not a valid array, initialize it as an empty array
        id = 0;
    }
}else{ // if creating a new to-do list
    LIST = [];
    id = 0;
}

//clear the local storage
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
})

//load items to the user's interface
function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash, item.timestamp);
    });
}

//adding item to local storage
localStorage.setItem("TODO", JSON.stringify(LIST));

//Show date
const today = new Date();
const options = {
    weekday: "long",
    month: "short",
    day: "numeric",
};
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

//Add to do function
function addToDo(toDo, id, done, trash, timestamp){
    if(trash)
        return;

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";
    const date = new Date(timestamp);
    const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        // second: "2-digit",
    };
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    const item = ` 
              <li class="item">
                <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                <p class="text ${LINE}"> ${toDo} <span class="timestamp">(${formattedTime})</span></p>                <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
              </li>
              `;
    const position = "beforeend"; // means add after the last element in the list
    list.insertAdjacentHTML(position, item);
}

//Add an item to the list when user hits the enter key
document.addEventListener("keyup", function(event){
    if(event.key === "Enter"){
        const toDo = input.value;
        if(toDo){ //if there is something in the input field
            const timestamp = new Date().toISOString();
            addToDo(toDo, id, false, false, timestamp);
            LIST.push({
                name : toDo,
                id : id,
                done : false,
                trash : false,
                timestamp : timestamp
            });
            localStorage.setItem("TODO", JSON.stringify(LIST));
            id++;
        }
        input.value = "";
    }
});

//Complete to do
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

//Remove to do
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
}

//target the items created dynamically
list.addEventListener("click", function(event){
    const element = event.target; // returns the clicked element
    const elementJob = element.attributes.job.value;

    if(elementJob == "complete"){   
        completeToDo(element);
    }else if(elementJob == "delete"){
        removeToDo(element);
    }
    localStorage.setItem("TODO", JSON.stringify(LIST));
});