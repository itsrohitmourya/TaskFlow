const regForm = document.querySelector('#regForm')
const name = document.querySelector('#regName')
const email = document.querySelector('#regEmail')
const password = document.querySelector("#regPass")
const subBtn = document.querySelector('#subBtn')
const toggleImg = document.querySelector('#toggleImg')
const regContainer = document.querySelector('.reg-container')

toggleImg.addEventListener('click', ()=>{
    if(password.type === 'password'){
        password.type = 'text'
        toggleImg.src = 'assets/show.png'
    }else{
        password.type = "password"
        toggleImg.src = 'assets/hidden.png'
    }
})


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
createObserver(regContainer, 'active', false, 1)

regForm.addEventListener('submit', async (e)=>{
    e.preventDefault()
    try {
        const res = await fetch('https://taskflow-rfbk.onrender.com/users/register', {
            method : 'POST',
            headers :{
                "content-Type" : "application/json"
            },
            body : JSON.stringify({
                name : name.value,
                email : email.value,
                password : password.value
            }),
            credentials : 'include'
        })

        const data = await res.json()
        if(res.status === 200 || res.ok){
            showToast(data.message, "success");
            window.location.hash = '#login'
        }else{
            showToast(data.message, 'error')
        }

    } catch (error) {
        showToast('Something went wrong', 'error')
    }
})