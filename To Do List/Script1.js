const todoB = document.querySelector('#submitTask');
// select the input box
const todoInput = document.querySelector('#inputTask');
// select the <ul> with class
const todoItemsList = document.querySelector('.list');


let taskList = [];

// add an eventListener on form, and listen for submit event
todoB.addEventListener('click', function (event) {
    // prevent the page from reloading when submitting the form
    event.preventDefault();
    addTodo(todoInput.value); // call addTodo function with input box current value
});

// function to add tasklist
function addTodo(item) {
    // if item is not empty
    if (item !== '') {

        const todo = {
            id: Date.now(),
            name: item,
            completed: false
        };

        // then add it to todos array
        taskList.push(todo);
        addToLocalStorage(taskList); // then store it in localStorage

        // finally clear the input box value
        todoInput.value = '';
    }
}

// function to render given todos to screen
function renderTodos(taskList) {
    /clear everything inside <ul> with class/
    todoItemsList.innerHTML = '';

    // run through each item inside todos
    taskList.forEach(function (item) {
        // check if the item is completed
        const checked = item.completed ? 'checked' : null;

        // make a <li> element and fill it
        // <li> </li>
        const li = document.createElement('li');
        // <li class="item"> </li>
        li.setAttribute('class', 'item');
        // <li class="item" data-key="20200708"> </li>
        li.setAttribute('data-key', item.id);
    
        // if item is completed, then add a class to <li> called 'checked', which will add line-through style
        const newspan = document.createElement("span");
        newspan.innerHTML = item.name;
        newspan.className = "task";
        if (item.completed === true) {
            /*li.classList.add('complete');*/
            newspan.style.textDecoration = 'line-through';
        }

        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${checked}>
        <button class="delete-btn">x</button>`
            ;
        li.insertBefore(newspan, li.childNodes[2]);
        // finally add the <li> to the <ul>
        todoItemsList.appendChild(li);


    });

}

// function to add todos to local storage
function addToLocalStorage(taskList) {
    // conver the array to string then store it.
    localStorage.setItem('tasks', JSON.stringify(taskList));
    // render them to screen
    renderTodos(taskList);
}

// function helps to get everything from local storage
function getFromLocalStorage() {
    const reference = localStorage.getItem('tasks');
    // if reference exists
    if (reference) {
        // converts back to array and store it in todos array
        taskList = JSON.parse(reference);
        renderTodos(taskList);
    }
}

// toggle the value to completed and not completed
function toggle(id) {
    taskList.forEach(function (item) {
        // use == not ===, because here types are different. One is number and other is string
        if (item.id == id) {
            // toggle the value
            item.completed = !item.completed;
        }
    });

    addToLocalStorage(taskList);
}


function deleteTodo(id) {
    // filters out the <li> with the id and updates the todos array
    taskList = taskList.filter(function (item) {
        // use != not !==, because here types are different. One is number and other is string
        return item.id != id;
    });

    // update the localStorage
    addToLocalStorage(taskList);
}

// initially get everything from localStorage
getFromLocalStorage();

// after that addEventListener <ul> with class=todoItems. Because we need to listen for click event in all delete-button and checkbox
todoItemsList.addEventListener('click', function (event) {
    // check if the event is on checkbox
    if (event.target.type === 'checkbox') {
        // toggle the state
        toggle(event.target.parentElement.getAttribute('data-key'));
    }

    // check if that is a delete-button
    if (event.target.classList.contains('delete-btn')) {
        // get id from data-key attribute's value of parent <li> where the delete-button is present
        deleteTodo(event.target.parentElement.getAttribute('data-key'));
    }
});