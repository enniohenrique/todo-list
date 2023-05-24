// Seleçção de elementos

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const filterSelect = document.querySelector("#filter-select");
const searchInput = document.querySelector("#search-input");
const eraseButton = document.querySelector("#erase-button");
const todos = document.querySelectorAll(".todo");

let oldInputValue;

// Funções
const saveTodo = (text, classe) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  if (classe != "undefined") {
    todo.classList.add(classe);
  }

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = fraseMaiuscula(text);
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = `	<i class="fa-solid fa-check"></i>`;
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = `	<i class="fa-solid fa-pen"></i>`;
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  todo.appendChild(deleteBtn);

  todoList.appendChild(todo);

  todoInput.value = "";
  todoInput.focus();

  salvarConfiguracoes(fraseMaiuscula(text), classe);
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = fraseMaiuscula(text);
    }
  });
};

const changeFilter = (filterValue) => {
  let todoList = document.querySelectorAll(".todo");

  if (filterValue.value === "all") {
    todoList.forEach((e) => {
      if (!e.classList.contains("all")) {
        e.classList.remove("hide");
      }
    });
  } else if (filterValue.value === "done") {
    todoList.forEach((e) => {
      e.classList.remove("hide");

      if (!e.classList.contains("done")) {
        e.classList.add("hide");
      }
    });
  }

  if (filterValue.value === "todo") {
    todoList.forEach((e) => {
      e.classList.remove("hide");

      if (e.classList.contains("done")) {
        e.classList.add("hide");
      }
    });
  }
};

function fraseMaiuscula(frase) {
  const fraseFinal = frase.replace(/(^\w{1})|(\s+\w{1})/g, (letra) =>
    letra.toUpperCase()
  );

  return fraseFinal;
}

function salvarConfiguracoes(texto, classe) {
  localStorage.setItem(texto, classe);
}

function excluirConfiguracoes(chave) {
  localStorage.removeItem(chave);
}

function recuperarDados() {
  let arrayDados = [];
  let objDados = {};

  if (localStorage.length) {
    for (var i = 0; i < localStorage.length; i++) {
      objDados = {
        titulo: localStorage.key(i),
        estado: localStorage.getItem(localStorage.key(i)),
      };

      arrayDados.push(objDados);
    }
    return arrayDados;
  }
}

// Eventos

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    // Salvando o todo
    saveTodo(inputValue, "undefined");
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");
    salvarConfiguracoes(todoTitle, parentEl.classList[1]);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    excluirConfiguracoes(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();

  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;
  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

filterSelect.addEventListener("change", (e) => {
  changeFilter(filterSelect, e);
});

searchInput.addEventListener("keyup", () => {
  const todo = document.querySelectorAll(".todo");

  todo.forEach((e) => {
    const frasePesquisada = fraseMaiuscula(searchInput.value);

    if (!e.innerText.includes(frasePesquisada)) {
      e.classList.add("hide");
    } else {
      e.classList.remove("hide");
    }
  });
});

eraseButton.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  const todos = document.querySelectorAll(".todo");
  todos.forEach((element) => {
    element.classList.remove("hide");
  });
});

const themeToggleBtn = document.getElementById("theme-toggle-btn");
const htmlElement = document.getElementsByTagName("html")[0];

themeToggleBtn.addEventListener("click", () => {
  htmlElement.classList.toggle("dark-theme");
});

if (localStorage.length) {
  const dadosRecuperados = recuperarDados();
  for (var i = 0; i < localStorage.length; i++) {
    saveTodo(dadosRecuperados[i].titulo, dadosRecuperados[i].estado);
  }
}
