const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todosContainer = document.getElementById("todos-container");
const emptyState = document.getElementById("empty-state");
const filterBtn = document.querySelectorAll(".filter-btn");
const totalTasks = document.getElementById("total-count");
const pendingTasks = document.getElementById("pending-count");
const completedTasks = document.getElementById("completed-count");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const confirmBtn = document.getElementById("confirm-btn");
const cancelBtn = document.getElementById("cancel-btn");
const editInput = document.getElementById("edit-input");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

function init() {
  renderTodos();
  // updateTodos()

  addBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", function (e) {
    let value = todoInput.value;
    const inputElement = e.target;

    if (value.length > 0) {
      // Capitalize the first character and combine with the rest of the string
      const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);

      // Update the input field's value
      inputElement.value = capitalizedValue;
      if (e.key === "Enter") addTodo();
    }
  });

  filterBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtn.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      currentFilter = this.getAttribute("data-filter");
      renderTodos();
    });
  });
}

const toggle = document.getElementById("theme-switch");
const root = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
  toggle.checked = savedTheme === "light";
}

// Toggle theme
toggle.addEventListener("change", () => {
  if (toggle.checked) {
    root.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    root.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
  }
});

function addTodo() {
  const text = todoInput.value.trim();

  if (text === "") {
    alert("Please Enter A Task");
    return;
  }

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  // updateTodos()

  todoInput.value = "";
  todoInput.focus();
}

function ToggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
  // updateTodos()
}

function EditTodo(id){

const todo = todos.find(todo => todo.id === id);

modalTitle.textContent = "Edit Task";
modalMessage.textContent = "Update your task";

editInput.style.display = "block";
editInput.value = todo.text;

confirmBtn.textContent = "Save";

modal.style.display = "flex";

confirmBtn.onclick = () => {

const newText = editInput.value.trim();

if(newText !== ""){
todo.text = newText;
saveTodos();
renderTodos();
}

editInput.style.display = "none";
modal.style.display = "none";

};

cancelBtn.onclick = () => {

editInput.style.display = "none";
modal.style.display = "none";

};

}

function DeleteTodo(id) {

modalTitle.textContent = "Delete Task";
modalMessage.textContent = "Are you sure you want to delete this task?";
confirmBtn.textContent = "Delete";

modal.style.display = "flex";

confirmBtn.onclick = () => {

todos = todos.filter(todo => todo.id !== id);

saveTodos();
renderTodos();

modal.style.display = "none";

};

cancelBtn.onclick = () => modal.style.display = "none";

}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  let filterTodos = [];

  if (currentFilter === "all") {
    filterTodos = todos;
  } else if (currentFilter === "pending") {
    filterTodos = todos.filter((todo) => !todo.completed);
  } else if (currentFilter === "completed") {
    filterTodos = todos.filter((todo) => todo.completed);
  }

  if (filterTodos.length === 0) {
    emptyState.style.display = "block";
    todosContainer.innerHTML = "";
    todosContainer.appendChild(emptyState);
  } else {
    emptyState.style.display = "none";

    todosContainer.innerHTML = "";

    filterTodos.forEach((todo) => {
      const todoItem = document.createElement("div");
      todoItem.className = `todo_item ${todo.completed ? "completed" : ""}`;

      todoItem.innerHTML = `
        <input type="checkbox" class="todo-checkbox"  ${todo.completed ? "checked" : ""}/>
        
        
        <div class="todo-text" >${escapeHtml(todo.text)}</div>
        <div class="todo-actions">
        <button class="action-btn edit-btn" title="Edit Task">
        <i class="fa-solid fa-pen"></i>
        </button>
        <button class="action-btn delete-btn" title="Delete Task">
        <i class="fa-solid fa-trash"></i>
        </button>
        </div>`;

      const checkBox = todoItem.querySelector(".todo-checkbox");
      const editBtn = todoItem.querySelector(".edit-btn");
      const deleteBtn = todoItem.querySelector(".delete-btn");

      checkBox.addEventListener("change", () => ToggleTodo(todo.id));
      editBtn.addEventListener("click", () => EditTodo(todo.id));
      deleteBtn.addEventListener("click", () => DeleteTodo(todo.id));

      todosContainer.appendChild(todoItem);
    });
  }
  updateStats();
}

function updateStats() {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  pendingTasks.textContent = pending;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", init);
