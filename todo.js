const select = document.querySelector(".custom-select");
const trigger = select.querySelector(".select-trigger");
const options = select.querySelectorAll(".select-options li");
const selected = select.querySelector(".selected-option");

trigger.addEventListener("click", () => {
  select.classList.toggle("open");
});

options.forEach((opt) => {
  opt.addEventListener("click", () => {
    options.forEach((o) => o.classList.remove("active"));
    opt.classList.add("active");
    selected.textContent = opt.textContent;
    select.classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  if (!select.contains(e.target)) select.classList.remove("open");
});

const form = document.querySelector("#todoForm");
const todoName = document.querySelector("#todoInput");
const priority = document.querySelector(".select-trigger");
const pendingList = document.querySelector(".penTodoList");
const completedList = document.querySelector(".comTodoList");
const penTodoMsg = document.querySelector(".penNoTodoMsg");
const comTodoMsg = document.querySelector(".comNoTodoMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const todo = todoName.value.trim();
  const level = priority.innerText;

  if (!todo) return alert("Please enter a task!");
  createTodo(todo, level);
  todoName.value = "";
});

let todos = [];

// first get the todos data
async function updateTodos() {
  pendingList.innerHTML = "";
  completedList.innerHTML = "";
  if (localStorage.getItem("todos")) {
    todos = JSON.parse(localStorage.getItem("todos"));
    createTodoCards(todos);
  } else {
    try {
      const res = await fetch("https://taskflow-rfbk.onrender.com/users/todos",{
        method : 'GET',
        credentials : 'include'
      });

      const data = await res.json();

      if (res.status === 200 || res.ok) {
        todos = data.todos;
        // does here also needed to stringyfy the todos
        localStorage.setItem("todos", JSON.stringify(data.todos));
        createTodoCards(todos);
      } else {
        showToast(data.message, "error");
        createTodoCards(todos);
      }
    } catch (error) {
      showToast("something went wrong", "error");
      createTodoCards(todos);
    }
  }
}
updateTodos();

// create a todo obj in todos
function createTodo(name, priority) {
  const todo = {
    id: crypto.randomUUID(),
    name,
    priority,
    status: false,
  };
  todos.push(todo);
  saveTodos(todos, todo);
}

async function saveTodos(todos, todo) {
  try {
    const res = await fetch("https://taskflow-rfbk.onrender.com/users/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todos }),
      credentials: "include",
    });

    const data = await res.json();

    if (res.status === 200 || res.ok) {
      localStorage.setItem("todos", JSON.stringify(todos));
      showToast(data.message, "success");
      if (todo) {
        todoCard(todo);
      }
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    showToast("something went wrong", "error");
  }
}

function createTodoCards(todos) {
  if (todos.length === 0) return updateTodoCon();
  todos.forEach((todo) => {
    todoCard(todo);
  });
}

function todoCard(todo) {
  const card = document.createElement("li");
  card.className = "todoCard";
  card.dataset.id = todo.id;
  const input = document.createElement("input");
  input.name = "todo";
  input.type = "text";
  input.className = "todoName";
  input.value = todo.name;
  input.readOnly = true;
  input.maxLength = 30;
  input.addEventListener("dblclick", (e) => handleTodoChange(e));
  const priority = document.createElement("span");
  priority.dataset.level = todo.priority;
  priority.innerText = todo.priority;
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.className = "todoCheck";
  checkBox.name = "todoState";
  checkBox.checked = todo.status;
  checkBox.addEventListener("change", (e) => handletodoState(e));
  const button = document.createElement("button");
  button.addEventListener("click", (e) => handleTodoDelete(e));
  const img = document.createElement("img");
  img.src = "assets/bin.png";
  img.alt = "Delete";
  button.appendChild(img);
  card.appendChild(input);
  card.appendChild(priority);
  card.appendChild(checkBox);
  card.appendChild(button);

  console.log(card);
  todo.status ? completedList.appendChild(card) : pendingList.appendChild(card)
  updateTodoCon();
}

function updateTodoCon() {
  if (pendingList.children.length === 0) {
    penTodoMsg.classList.add("active");
  } else {
    penTodoMsg.classList.remove("active");
  }
  if (completedList.children.length === 0) {
    comTodoMsg.classList.add("active");
  } else {
    comTodoMsg.classList.remove("active");
  }
}

async function handleTodoDelete(e) {
  const card = e.target.closest(`[data-id]`);
  if (!card) return;
  try {
    const res = await fetch(`https://taskflow-rfbk.onrender.com/users/todos/${card.dataset.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await res.json();
    if (res.status === 200 || res.ok) {
      todos = todos.filter((todo) => todo.id !== card.dataset.id);
      localStorage.setItem("todos", JSON.stringify(todos));
      card.remove();
      showToast(data.message, "success");
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    showToast("something went wrong", "error");
  }
  updateTodoCon();
}

async function handletodoState(e) {
  const card = e.target.closest(`[data-id]`);
  if (!card) return;
  try {
    const res = await fetch(`https://taskflow-rfbk.onrender.com/users/todos/${card.dataset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: e.target.checked }),
      credentials: "include",
    });

    const data = await res.json();

    if (res.status === 200 || res.ok) {
      showToast(data.message, "success");
      todos = todos.map((todo) => {
        if (todo.id === card.dataset.id) {
          todo.status = e.target.checked;
        }
        return todo;
      });
      localStorage.setItem("todos", JSON.stringify(todos));
      card.remove()
      e.target.checked ? completedList.appendChild(card) : pendingList.appendChild(card)
    }
  } catch (error) {
    showToast("something went wrong", "error");
    e.target.checked = !e.target.checked;
  }
  updateTodoCon();
}

function handleTodoChange(e) {
  const input = e.target;
  if (!input || !input.classList.contains("todoName")) return;

  const id = e.target.closest("[data-id]").dataset.id;
  input.readOnly = false;
  input.classList.add("active");

  const oldValue = input.value;

  const finishEdit = async () => {
    input.readOnly = true;
    input.classList.remove("active");
    input.removeEventListener("blur", finishEdit);
    input.removeEventListener("keydown", handleKey);
    if (input.value !== oldValue) {
      try {
        const res = await fetch(`https://taskflow-rfbk.onrender.com/users/todos/${id}`, {
          method: "PATCH",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ name: input.value }),
          credentials: "include",
        });

        const data = await res.json();

        if (res.status === 200 || res.ok) {
          showToast(data.message, "success");

          todos = todos.map((todo) => {
            if (todo.id === id) todo.name = input.value;
            return todo;
          });
          localStorage.setItem("todos", JSON.stringify(todos));
        } else {
          showToast(data.message, "error");
          input.value = oldValue;
        }
      } catch (error) {
        showToast("something went wrong", "error");
        input.value = oldValue;
      }
    }
  };

  const handleKey = (event) => {
    if (event.key === "Enter") {
      finishEdit();
    } else if (event.key === "Escape") {
      finishEdit();
    }
  };

  input.addEventListener("blur", finishEdit);
  input.addEventListener("keydown", handleKey);
}
