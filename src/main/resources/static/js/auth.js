const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");
const message = document.getElementById("message");
const rmessage = document.getElementById("reg-message");

// Helper: show messages
function showMessage(text, success = false) {
  message.textContent = text;
  message.style.color = success ? "green" : "red";
}

// Register Form Submission
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const firstName = document.getElementById("reg-firstname").value.trim();
  const lastName = document.getElementById("reg-lastname").value.trim();

  if(password.length <= 10 || !/[A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
    alert("Invalid password. Password must contain 10 characters, including 1 capital letter, and 1 symbol.")
  }


  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage("Registration successful! You can now log in.", true);
      closeRegisterModal();
    } else {
      rmessage.innerHTML = `<p style='color:red;'><b>${data.message}</b></p>`;
      showMessage("Registration failed.");
    }
  } catch (err) {
    showMessage("An error occurred during registration.");
  }
});

// Login Form Submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("jwt", data.token);
      showMessage("Login successful! Redirecting...", true);
      setTimeout(() => {
        window.location.href = "/dashboard.html";
      }, 1000);
    } else {
      showMessage(data.message || "Login failed. Check your credentials.");
    }
  } catch (err) {
    showMessage("An error occurred during login.");
  }
});

function openRegisterModal() {
  document.getElementById("register-modal").style.display = "block";
}

function closeRegisterModal() {
  document.getElementById("register-modal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("register-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};