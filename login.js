const loginContainer = document.querySelector('.login-container')
const loginForm = document.querySelector("#loginForm");
const email = document.querySelector("#logEmail");
const password = document.querySelector("#logPass");
const submitBtn = document.querySelector("#subBtn");
const toggleImg = document.querySelector("#toggleImg");

// page animation
function createObserver(element, className, removeBool, thresholdValue) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
        } else if (removeBool) {
          entry.target.classList.remove(className);
        }
      });
    },
    {
      threshold: thresholdValue,
    }
  );
  if (
    NodeList.prototype.isPrototypeOf(element) ||
    HTMLCollection.prototype.isPrototypeOf(element)
  ) {
    element.forEach((ele) => observer.observe(ele));
  } else {
    observer.observe(element);
  }
}
createObserver(loginContainer, 'active', false, 1)

toggleImg.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
    toggleImg.src = "assets/show.png";
  } else {
    password.type = "password";
    toggleImg.src = "assets/hidden.png";
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (e.isTrusted) {
    try {
      const res = await fetch("https://taskflow-2wd2.onrender.com/users/login", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.status === 200 || res.ok) {
        showToast(data.message, "success");
        window.location.hash = "#todo";
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  }
});

// 