let todoForm = document.getElementById('todo_form')
let buttonNewToDo = document.getElementById('add_item_btn')
let bodyHeader = document.getElementById('todo_status_text')
let todosBody = document.getElementById('todo_list')
let textAreaForTodo = document.getElementById('input')
let dropDownItems = document.getElementsByClassName('menu_item')

const TODO_STATE = {DELETED: 'Removed', COMPLETED: 'Completed', IN_PROGRESS: 'In Progress'}
const HEADER = {DELETED: 'Removed Todos', COMPLETED: 'Completed Todos', IN_PROGRESS: 'Today'}

const todoInProgressClass = 'default'
const todoRemovedClass = 'removed'
const todoCompletedClass = 'completed'


window.onload = loadTodos;
window.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        toggleTextArea(event)
    }
})

todoForm.addEventListener('submit', toggleTextArea)
Array.from(dropDownItems).forEach(element => element.onclick = toggleDisplayTodos)

function toggleDisplayTodos(event) {
    updateTaskBody(event.target.innerHTML)
}

function loadTodos(event){
    todosBody.innerHTML = '';
    $.ajax({
        url: "/api",
        type: "get",
        success: function(data) {
            fillTodos(data)
            alert('Success loading todos')
        },
        error: function (msg) {
            alert('Failed to load todos')
            toggleTextArea(event);
        }
    });
}

function fillTodos(data) {
    data.forEach(todo => {
        let todoDiv = getTask(todo.id, todo.name, todo.status);
        todosBody.insertAdjacentHTML('beforeend', todoDiv);
    });
    updateTaskBody(TODO_STATE.IN_PROGRESS);
}

function addTask(text) {
    $.ajax({
        url: '/api',
        contentType: "application/json",
        method: 'post',
        dataType: 'json',
        data: JSON.stringify({name: text, status: 'IN_PROGRESS'}),
        success: function (todo) {
            let todoDiv = getTask(todo.id, todo.name, todo.status);
            todosBody.insertAdjacentHTML('beforeend', todoDiv);
        },
        error: function (msg) {
            alert(`Failed to add todo! Cause: ${msg.responseText}`);
        }
    })
}

function toggleTextArea(event) {
    event.preventDefault();
    if (textAreaForTodo.value) {
        buttonNewToDo.classList.toggle("showInput");
        textAreaForTodo.classList.toggle('showInput');

        let text = textAreaForTodo.value
        if (text.length > 0) {
            addTask(textAreaForTodo.value);
        }
        textAreaForTodo.value = ''
        updateTaskBody(TODO_STATE.IN_PROGRESS)
    } else {
        buttonNewToDo.classList.toggle("showInput");
        textAreaForTodo.classList.toggle('showInput');
        textAreaForTodo.focus()
    }
}

function getTask(id, text, status) {
    let cross = `<div class="fa-solid fa-circle-xmark" onclick="deleted(this)"></div>`;
    let todoClass = 'default';
    if (status === 'COMPLETED') {
        todoClass = 'completed';
    } else if (status === 'REMOVED') {
        todoClass = 'removed';
        cross = `<div class="fa-solid fa-circle-xmark" onclick="deleteTask(id)"></div>`;
    }

    return `<div class="todo_item ${todoClass}" id="${id}">
                <div class="circle" onclick="completed(this)"></div>
                <div class="todo_description">${text}</div>
                ${cross}
            </div>`
}

function completed(element) {
    let parentDiv = element.parentElement
    let id = parentDiv.id;
    let headerElement = parentDiv.querySelector("[class='todo_description']")
    let name = headerElement.innerText;
    updateTask(id, name, 'COMPLETED')
    element.onclick = null;
    parentDiv.classList.remove(todoInProgressClass)
    let circle = parentDiv.querySelector("[class='circle']")
    circle.onclick = null;
    parentDiv.classList.add(todoCompletedClass)
    parentDiv.style.display = 'none'
}

function deleted(element) {
    let parentDiv = element.parentElement
    let id = parentDiv.id;
    let headerElement = parentDiv.querySelector("[class='todo_description']")
    let name = headerElement.innerText;
    updateTask(id, name, 'REMOVED')

    parentDiv.classList.remove(todoInProgressClass)
    parentDiv.classList.remove(todoCompletedClass)
    let circle = parentDiv.querySelector("[class='circle']")
    circle.onclick = null;
    parentDiv.classList.add(todoRemovedClass)
    parentDiv.style.display = 'none'

    let crossElement = parentDiv.querySelector("[class='fa-solid fa-circle-xmark']")
    crossElement.setAttribute('onclick', `deleteTask(${id})`);
}

function deleteTask(id) {
    $.ajax({
        url: '/api/' + id,
        contentType: "application/json",
        method: 'delete',
        success: function () {
            document.getElementById(id).remove();
        },
        error: function (msg) {
            alert(`Failed to delete todo! Cause: ${msg.responseText}`);
        }
    })
}

function updateTask(id, name, status) {
    $.ajax({
        url: '/api/',
        contentType: "application/json",
        method: 'put',
        data: JSON.stringify({id: id, name: name, status: status}),
        error: function (msg) {
            alert(`Failed to update todo! Cause: ${msg.responseText}`);
        }
    })
}

function updateTaskBody(todoState) {
    if (todoState == null) {
        return
    }
    let classToEnable = null
    let header = null
    switch (todoState) {
        case TODO_STATE.DELETED:
            classToEnable = todoRemovedClass
            header = HEADER.DELETED
            break
        case TODO_STATE.IN_PROGRESS:
            classToEnable = todoInProgressClass
            header = HEADER.IN_PROGRESS
            break
        case TODO_STATE.COMPLETED:
            classToEnable = todoCompletedClass
            header = HEADER.COMPLETED
            break
    }
    let todos = document.getElementsByClassName('todo_item')
    Array.from(todos).forEach(todo => {
        if (todo.classList.contains(classToEnable)) {
            todo.style.display = 'flex'
        } else {
            todo.style.display = 'none'
        }
    })
    bodyHeader.innerText = header
}