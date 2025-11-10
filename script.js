const content = document.getElementById("content");
const hamMenuLink = document.querySelectorAll(".hamMenuLink");
const scriptColl = {
  home : 'home.js',
  about : 'about.js',
  todo : 'todo.js',
  contact : 'contact.js',
  login : 'login.js'
}
async function loadPages(page) {
  try {
    const res = await fetch(`pages/${page}.html`);
    if (!res.ok) throw new Error("Page not found");
    const data = await res.text();
    const oldScript = document.getElementById('pageScript')
    if(oldScript) oldScript.remove()
    content.innerHTML = data;

    const scriptPath = scriptColl[page]
    if(scriptPath){
      try {
        const scriptRes = await fetch(scriptPath + `?v=${Date.now()}`)
        const scriptCode = await scriptRes.text()
        new Function(scriptCode)()
      } catch (error) {
        console.warn(`${page}.js not found or failed to execute`);
      }
    }

  } catch (error) {
    content.innerHTML = `<h2 style="
    height: 92vh;
    display: flex;
    justify-content: center;
    align-items: center;
  ">
    404 - Page not found
  </h2>`;
  }
}

function initRouter() {
  let hash = window.location.hash.substring(1);
  if (!hash) {
    hash = "home";
    window.location.hash = "#home";
  }
  loadPages(hash);
}

window.addEventListener("load", initRouter);

window.addEventListener("hashchange", () => {
  const page = window.location.hash.substring(1);
  loadPages(page);
  hamMenuLink.forEach((link) => {
    const linkText = link.textContent.trim().toLowerCase();
    if (linkText == page) {
      link.classList.add("active");
      console.log(link);
    } else {
      link.classList.remove("active");
    }
    console.log(hamMenuLink);
  });
});
