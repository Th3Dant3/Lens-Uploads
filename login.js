/**************************************************
 * CONFIG
 **************************************************/
const AUTH_API =
  "https://script.google.com/macros/s/AKfycbzESjnpNzOyDP76Gm6atwBgh5txV5N2AI225kxz5Q8w7jXgVTIqZrDtIIpQigEE6250/exec";

/**************************************************
 * LOGIN HANDLER
 **************************************************/
function login() {
  const usernameEl = document.getElementById("username");
  const passwordEl = document.getElementById("password");
  const messageEl = document.getElementById("message");

  const username = usernameEl.value.trim().toUpperCase();
  const password = passwordEl.value.trim();

  messageEl.textContent = "";
  messageEl.style.color = "red";

  if (!username || !password) {
    messageEl.textContent = "Enter username and password";
    return;
  }

  const url =
    `${AUTH_API}?action=login` +
    `&username=${encodeURIComponent(username)}` +
    `&password=${encodeURIComponent(password)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => handleLoginResponse(data, password))
    .catch(err => {
      console.error(err);
      messageEl.textContent = "Connection error";
    });
}

/**************************************************
 * HANDLE LOGIN RESPONSE
 **************************************************/
function handleLoginResponse(data, originalPassword) {
  const messageEl = document.getElementById("message");

  // Reset styles
  messageEl.style.color = "#f87171";

  // Backend error (wrong user / wrong password)
  if (data.status === "ERROR") {
    messageEl.textContent =
      data.message || "Invalid username or password";
    return;
  }

  // First-time login
  if (data.status === "SET_PASSWORD_REQUIRED") {
    messageEl.style.color = "#fbbf24";
    messageEl.textContent = "First login detected. Setting password...";
    setPassword(data.username, originalPassword);
    return;
  }

  // Successful login
  if (data.status === "SUCCESS") {
    messageEl.style.color = "#6ee7b7";
    messageEl.textContent = "Login successful. Redirecting…";

    sessionStorage.setItem("lms_logged_in", "true");
    sessionStorage.setItem("lms_user", data.username);
    sessionStorage.setItem("lms_role", data.role);
    sessionStorage.setItem("lms_subRole", data.subRole);

    setTimeout(() => {
      window.location.replace("index.html");
    }, 600); // small delay so user sees success
    return;
  }

  // Fallback
  messageEl.textContent = "Unexpected login response";
}

/**************************************************
 * SET PASSWORD (FIRST LOGIN)
 **************************************************/
function setPassword(username, password) {
  const messageEl = document.getElementById("message");

  const url =
    `${AUTH_API}?action=setPassword` +
    `&username=${encodeURIComponent(username)}` +
    `&password=${encodeURIComponent(password)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.status !== "PASSWORD_SET") {
        messageEl.textContent = "Failed to set password";
        return;
      }

      sessionStorage.setItem("lms_logged_in", "true"); // ✅ FIX
      sessionStorage.setItem("lms_user", username);
      window.location.replace("index.html");
    })
    .catch(err => {
      console.error(err);
      messageEl.textContent = "Password setup failed";
    });
}

/**************************************************
 * ENTER KEY SUPPORT
 **************************************************/
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    login();
  }
});
