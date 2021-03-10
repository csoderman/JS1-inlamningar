const form = document.querySelector('#formTodo');
const todoInput = document.querySelector('#addTodo');
const todoList = document.querySelector('#todoList');

let todos = [];

const fetchTodos = () => {
    fetch('https://jsonplaceholder.typicode.com/todos')
        .then(res => res.json())
        .then(data => {
            todos = data;
            listTodos();
        })
}

fetchTodos();

const listTodos = () => {
    todoList.innerHTML = '';
    let max = 0;
    for (let i = 0, len = todos.length; i < len; i++) {
        if (max === 10)
            break;

        todoList.insertAdjacentHTML('beforeend', `
        <div class="card p-3 my-2">
            <div class="d-flex justify-content-between align-items-center">
                <h3>${todos[i].title}</h3>
                <div>
                    <button class="btn btn-success"><i class="fas fa-check"></i></button>
                    <button class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
        `)

        max++;
    }
}

const createTodo = (title) => {
    fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            title,
            completed: false
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)

        let newTodo = {
            ...data,
            id: Date.now().toString()
        }
        todos.unshift(newTodo);
        listTodos();
    })
}
  

const validateText = (id) => {
    const input = document.querySelector('#' + id);
    const error = input.nextElementSibling;

    if(input.value.trim() === '') {
        error.innerText = "Can't add an empty todo.";
        input.classList.add('is-invalid');
        return false;
    } else if(input.value.length < 2) {
        error.innerText = 'The todo must be at least 2 characters long';
        input.classList.add('is-invalid');
        return false;
    } else {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        return true;
    }
}

const clearFields = () => {
    document.querySelectorAll('input').forEach(input => {
        input.value = '';
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
      })
}

// EVENTS

form.addEventListener('submit', (e) => {
    // Prevent submit
    e.preventDefault();
  
    console.log("Sumbittat");

    if (validateText('addTodo')) {
        createTodo(todoInput.value);
        clearFields();
    }

});

