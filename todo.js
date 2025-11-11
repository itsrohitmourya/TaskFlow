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

  createTodoCard(todo, level);
  todoName.value = "";
});

function createTodoCard(todoName, level) {
  const card = document.createElement("li");
  card.className = "todoCard";
  const input = document.createElement("input");
  input.name = "todo";
  input.type = "text";
  input.className = "todoName";
  input.value = todoName;
  input.readOnly = true;
  input.maxLength = 30
  input.addEventListener('dblclick', (e)=> handleTodoChange(e))
  const priority = document.createElement("span");
  priority.dataset.level = level;
  priority.innerText = level;
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.className = "todoCheck";
  checkBox.name = "todoState";
  checkBox.addEventListener('change',(e)=> handletodoState(e))
  const button = document.createElement("button");
  button.addEventListener("click", (e) => handleTodoDelete(e));
  const img = document.createElement("img");
  img.src = "assets/bin.png";
  img.alt = "Delete";
  button.appendChild(img);
  const id = crypto.randomUUID()
  card.dataset.id = id 
  card.appendChild(input);
  card.appendChild(priority);
  card.appendChild(checkBox);
  card.appendChild(button);
  pendingList.appendChild(card);
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
updateTodoCon();

function handleTodoDelete(e) {
    const card = e.target.closest(`[data-id]`)
    if(!card) return
    card.remove()
    updateTodoCon()
}
function handletodoState(e){
    const card = e.target.closest(`[data-id]`)
    if(!card) return
    if(e.target.checked){
        card.remove()
        completedList.appendChild(card)
    }else{
        card.remove()
        pendingList.appendChild(card)
    }
    updateTodoCon()
}
function handleTodoChange(e) {
  const input = e.target;
  if (!input || !input.classList.contains("todoName")) return;

  input.readOnly = false;
  input.classList.add('active')

  const oldValue = input.value;

  const finishEdit = () => {
    input.readOnly = true;
    input.classList.remove("active");
    input.removeEventListener("blur", finishEdit);
    input.removeEventListener("keydown", handleKey);
  };

  const handleKey = (event) => {
    if (event.key === "Enter") {
      finishEdit();
    } else if (event.key === "Escape") {
      input.value = oldValue; // restore old value
      finishEdit();
    }
  };

  input.addEventListener("blur", finishEdit);
  input.addEventListener("keydown", handleKey);
}
