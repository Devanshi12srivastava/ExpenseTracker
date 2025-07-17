const loginForm = document.querySelector("#loginForm");
const createForm = document.querySelector("#create-account");
const showLogin = document.getElementById("showlogin");
const showAccount = document.getElementById("showaccount");

// login form inputs
const email = document.getElementById("loginEmail");
const password = document.getElementById("loginPassword");

// create account inputs
const email1 = document.getElementById("accountEmail");
const password1 = document.getElementById("accountPassword");

// error spans
const EmailError = document.getElementById("Emailerror");  // check exact ID in HTML
const passwordError = document.getElementById("Passworderror");

loginForm.style.display = 'block';
createForm.style.display = 'none';

showAccount?.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  createForm.style.display = 'block';
});

showLogin?.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'block';
  createForm.style.display = 'none';
});

// ✅ Email Validation
function ValidateEmail() {
  const EmailValue = email1.value.trim();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (EmailValue.length === 0) {
    EmailError.innerHTML = "Enter an email";
    EmailError.style.color = "red";
    return false;
  }
  if (!regex.test(EmailValue)) {
    EmailError.innerHTML = "Enter a valid email";
    EmailError.style.color = "red";
    return false;
  }
  EmailError.innerHTML = "✔️ Valid Email";
  EmailError.style.color = "green";
  return true;
}

// ✅ Password Validation
function ValidatePassword() {
  const passval = password1.value.trim();
  if (passval.length === 0) {
    passwordError.innerHTML = "Enter a password";
    passwordError.style.color = "red";
  } else if (passval.length < 5) {
    passwordError.innerHTML = "Password must be at least 5 characters";
    passwordError.style.color = "red";
  } else if (!/[A-Z]/.test(passval)) {
    passwordError.innerHTML = "Include at least one uppercase letter";
    passwordError.style.color = "red";
  } else if (!/[a-z]/.test(passval)) {
    passwordError.innerHTML = "Include at least one lowercase letter";
    passwordError.style.color = "red";
  } else if (!/[0-9]/.test(passval)) {
    passwordError.innerHTML = "Include at least one number";
    passwordError.style.color = "red";
  } else if (!/[@$!%*#?&]/.test(passval)) {
    passwordError.innerHTML = "Include at least one special character (@$!%*#?&)";
    passwordError.style.color = "red";
  } else {
    passwordError.innerHTML = "✔️ Strong password";
    passwordError.style.color = "green";
    return true;
  }

  return false;
}

// ✅ Login Form Submit
loginForm.onsubmit = function (e) {
  e.preventDefault();
  const emailval = email.value.trim();
  const passval = password.value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const found = users.find(u => u.email === emailval && u.password === passval);

  if (found) {
    localStorage.setItem("currentuser", JSON.stringify(found));
    window.location.href = "tracker.html";
  } else {
    alert("❌ Invalid email or password");
  }
};

// ✅ Create Account Form Submit
createForm.onsubmit = function (e) {
  e.preventDefault();

  // validate first
  const isEmailValid = ValidateEmail();
  const isPasswordValid = ValidatePassword();

  if (!isEmailValid || !isPasswordValid) {
    return;
  }

  const emailvalue = email1.value.trim();
  const passwordvalue = password1.value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const alreadyExists = users.some(u => u.email === emailvalue);
  if (alreadyExists) {
    alert("⚠️ Email already registered");
    return;
  }

  // ✅ Use correct key names: `email`, `password`
  const newUser = { email: emailvalue, password: passwordvalue };
  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));
  alert("✅ Account created. Please login.");
  window.location.href = "index.html";
};
