class Todo {
  constructor(text, isDone = false) {
    this.text = text;
    this.isDone = isDone;
    this.id = Date.now().toString();
  }
}

let todos = [];

// 1.)
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

// 2.)
function addNewTodoToDOM({ text, isDone, id }) {
  // dodaj div element na DOM
  const divElement = document.createElement("div");
  divElement.innerHTML = `
      <input type="checkbox" name="checkbox-${id}" id="checkbox-${id}" />
      <label for="checkbox-${id}">${text}</label>
      <button>&times</button>
    `;
  // odredi inicijalni status checkbox-a
  const inputElement = divElement.querySelector("input");
  inputElement.checked = isDone;
  // manualna promjena statusa checkbox-a (change event)
  inputElement.addEventListener("change", function () {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      todo.isDone = this.checked;
      saveTodosToLocalStorage();
    }
  });
  // appendanje novog div elementa u DOM-u
  document.querySelector("main").appendChild(divElement);

  // 3.)
  // Izbriši todo
  const buttonElement = divElement.querySelector("button");
  buttonElement.addEventListener("click", () => {
    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex !== -1) {
      divElement.remove();
      todos.splice(todoIndex, 1);
      saveTodosToLocalStorage();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const storedTodos = localStorage.getItem("TODOS");
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
    todos.forEach((todo) => addNewTodoToDOM(todo));
  }
});

// 4.)
// Obriši sve gotove
const removeDoneButton = document.getElementById("remove-done-button");
removeDoneButton.addEventListener("click", removeDoneTodos);

function removeDoneTodos() {
  // Get all the todos with checked input
  const checkedTodos = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  // Loop through all the checked todos and remove their parent node (div element) from the DOM
  checkedTodos.forEach((checkedTodo) => {
    checkedTodo.parentNode.remove();
  });
  // Remove all the checked todos from the todos array and returns a new array that contains only the todos that are not completed
  todos = todos.filter((todo) => !todo.isDone);
  // Update the local storage with the new todos array
  saveTodosToLocalStorage();
}

function saveTodosToLocalStorage() {
  localStorage.setItem("TODOS", JSON.stringify(todos));
}
