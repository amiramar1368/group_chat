const signInForm = document.getElementById("sign-in");
const registerForm = document.getElementById("sign-up");
const toggleSigning = document.getElementsByClassName("toggle-signing");
const inputFile = document.getElementById("avatar");
const signinHeader = document.getElementById("signin-header");
const signupHeader = document.getElementById("signup-header");


signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("sign-in-username").value;
  const password = document.getElementById("sign-in-password").value;
  try {
    const { data } = await axios.post("/users/sign-in", { username, password });
    if (data.success) {
      iziToast.success({
        title: "Success",
        message: data.message,
        position: "topCenter",
        timeout: 1000,
      });
      const user = {
         id: data.body.user.id,
          fullname: data.body.user.fullname,
          image:data.body.user.image 
        };
        const groups = data.body.user.groups;
        localStorage.user = JSON.stringify(user);
        localStorage.groups = JSON.stringify(groups);
      setTimeout(() => {
        location.href = "/chat/home";
      }, 1000);
    } else {
      iziToast.error({
        title: "Error",
        message: data.message,
        position: "topCenter",
      });
    }
  } catch (err) {
    iziToast.error({
      title: "Error",
      message: err.response?.data.message,
      position: "topCenter",
    });
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("sign-up-username").value;
  const password = document.getElementById("sign-up-password").value;
  const fullname = document.getElementById("sign-up-fullname").value;

  const form = new FormData();
  form.append("avatar", inputFile.files[0]);
  form.append("username", username);
  form.append("password", password);
  form.append("fullname", fullname);
  try {
    const { data } = await axios.post("/users/sign-up", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (data.success) {
      iziToast.success({
        title: "Success",
        message: data.message,
        position: "topCenter",
        timeout: 3000,
      });
      registerForm.classList.add("d-none");
      signInForm.classList.remove("d-none");
    }
  } catch (err) {
    iziToast.error({
      title: "Error",
      message: err.response?.data.message,
      position: "topCenter",
    });
  }
});

inputFile.addEventListener("change", () => {
  document.getElementById("file-name").innerHTML = inputFile.files[0].name;
});

Array.from(toggleSigning).forEach((btn) =>
  btn.addEventListener("click", () => {
    registerForm.classList.toggle("d-none");
    signInForm.classList.toggle("d-none");
    signinHeader.classList.toggle("d-none");
    signupHeader.classList.toggle("d-none");
  })
);
