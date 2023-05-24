class Todo {
  constructor(text, isDone = false) {
    this.text = text;
    this.isDone = isDone;
    this.id = Date.now().toString();
  }
}

let todos = [];

// CREATE - add new todo
const todoForm = document.forms.namedItem("todo-form");
todoForm.addEventListener("submit", handleFormSubmission);

function handleFormSubmission(event) {
  event.preventDefault();
  const inputValue = todoForm.querySelector("input")?.value;
  if (inputValue) {
    const newTodo = new Todo(inputValue);
    addNewTodoToDOM(newTodo);
    todos.push(newTodo);
    saveTodosToLocalStorage();
    todoForm.reset();
    console.log(todos[todos.length - 1]);
  }
}

// READ - load todos from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  const storedTodos = localStorage.getItem("TODOS");
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
    todos.forEach((todo) => addNewTodoToDOM(todo));
  }
});

// CREATE - add new todo to DOM
function addNewTodoToDOM({ text, isDone, id }) {
  const divElement = document.createElement("div");
  divElement.classList.add("todo");
  divElement.innerHTML = `
          <input type="checkbox" class="todo-checkbox" name="checkbox-${id}" id="checkbox-${id}" />
          <label for="checkbox-${id}">${text}</label>
          <button class="edit-button">&#9998;</button>
          <button class="delete-button">&#10060;</button>
        `;
  const inputElement = divElement.querySelector("input");
  inputElement.checked = isDone;
  // UPDATE - change checkbox status
  inputElement.addEventListener("change", function () {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      todo.isDone = this.checked;
      saveTodosToLocalStorage();
    }
  });

  // DELETE - delete each, particular todo
  const deleteButtonElement = divElement.querySelector(".delete-button");
  deleteButtonElement.addEventListener("click", function () {
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex !== -1) {
      divElement.remove();
      todos.splice(todoIndex, 1);
      saveTodosToLocalStorage();
    }
  });
  // UPDATE - edit each, particular todo
  const editButtonElement = divElement.querySelector(".edit-button");
  editButtonElement.addEventListener("click", function () {
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    const updatedTodoText = prompt("Edit Todo Text", text);
    if (updatedTodoText) {
      const updatedTodo = new Todo(updatedTodoText, isDone);
      todos[todoIndex] = updatedTodo;
      divElement.querySelector("label").textContent = updatedTodoText;
      saveTodosToLocalStorage();
    }
  });

  // READ - display todos on the DOM
  document.querySelector("main").appendChild(divElement);
}

// DELETE - just remove all todos
const removeAllButton = document.getElementById("remove-all-button");
removeAllButton.addEventListener("click", removeAllTodos);

function removeAllTodos() {
  const allTodos = document.querySelectorAll("main div");
  allTodos.forEach((todo) => {
    todo.remove();
  });
  todos = [];
  saveTodosToLocalStorage();
}

// DELETE - remove all DONE todos
const removeDoneButton = document.getElementById("remove-done-button");
removeDoneButton.addEventListener("click", removeDoneTodos);

function removeDoneTodos() {
  const checkedTodos = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  checkedTodos.forEach((checkedTodo) => {
    checkedTodo.parentNode.remove();
  });
  todos = todos.filter((todo) => !todo.isDone);
  saveTodosToLocalStorage();
}

// UPDATE - update changes to the local storage
function saveTodosToLocalStorage() {
  localStorage.setItem("TODOS", JSON.stringify(todos));
}
