const content = document.getElementById("content");
const hamMenuLink = document.querySelectorAll(".hamMenuLink");
const login = document.querySelector("#login");
const userCard = document.querySelector("#userCard");
const userMenu = document.querySelector("#userMenu");
const logoutBtn = document.querySelector("#logoutBtn");
const userName = document.querySelector('#userName')

const scriptColl = {
  home: "home.js",
  about: "about.js",
  todo: "todo.js",
  contact: "contact.js",
  login: "login.js",
  register: "register.js",
};

// page loading logic
async function loadPages(page) {
  try {
    const res = await fetch(`pages/${page}.html`);
    if (!res.ok) throw new Error("Page not found");
    const data = await res.text();
    const oldScript = document.getElementById("pageScript");
    if (oldScript) oldScript.remove();
    content.innerHTML = data;

    const scriptPath = scriptColl[page];
    if (scriptPath) {
      try {
        const scriptRes = await fetch(scriptPath + `?v=${Date.now()}`);
        const scriptCode = await scriptRes.text();
        new Function(scriptCode)();
      } catch (error) {
        content.innerHTML = `<section id="Sec404">
  </section>`;
      }
    }
  } catch (error) {
    content.innerHTML = `<section id="Sec404">
  </section>`;
  }
}

// always first loads home page
function initRouter() {
  let hash = window.location.hash.substring(1);
  if (!hash) {
    hash = "home";
    window.location.hash = "#home";
  }
  loadPages(hash);
}
window.addEventListener("load", initRouter);

const menu = document.querySelector("#menu");

// handle page change
window.addEventListener("hashchange", async () => {
  const page = window.location.hash.substring(1);
  menu.checked = false;
  hamMenuLink.forEach((link) => {
    const linkText = link.textContent.trim().toLowerCase();
    if (linkText == page) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  if (page === "todo") {
    const ok = await authCheck();
    updateUI()
    if (!ok) return;
  }
  loadPages(page);
});

// check user auth
let authUser = JSON.parse(localStorage.getItem("authUser") || null)
async function authCheck() {
  if(authUser) return true;
  try {
    const res = await fetch("http://localhost:3000/users/me", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (res.status === 200) {
      authUser = data.user
      localStorage.setItem('authUser', JSON.stringify(data.user))
      userName.innerText = data.user?.name
      return true;
    } else {
      window.location.hash = "#login";
    }
  } catch (error) {
    console.log("auth check failed");
    window.location.hash = "#login";
  }
}

// toast msg handling
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

userCard.addEventListener("click", (e) => {
  if (!e.target.closest("#userMenu")) {
    userMenu.classList.toggle("hidden");
    userCard.classList.toggle("open");
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest("#userCard")) {
    userMenu.classList.add("hidden");
    userCard.classList.remove("open");
  }
  if (e.target.closest("#content")) {
    menu.checked = false;
  }
});

logoutBtn.addEventListener("click", async (e) => {
  try {
    const res = await fetch("http://localhost:3000/users/logout", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (res.status === 200 || res.ok) {
      userMenu.classList.toggle("hidden");
      userCard.classList.toggle("open");
      showToast(data.message, "success");
      window.location.hash = "#login"
      authUser = null
      localStorage.removeItem('authUser')
      updateUI()
    } else {
      showToast(data.message, "error");
    }
  } catch (error) {
    showToast("Something went wrong", "error");
  }
});

function updateUI(){
  if(authUser){
    login.classList.add('hidden')
    userCard.classList.remove('hidden')
  }else{
    login.classList.remove('hidden')
    userCard.classList.add('hidden')
  }
}
updateUI()