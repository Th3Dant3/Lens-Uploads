const API_URL =
  "https://script.google.com/macros/s/AKfycbzESjnpNzOyDP76Gm6atwBgh5txV5N2AI225kxz5Q8w7jXgVTIqZrDtIIpQigEE6250/exec";

async function login() {
  const username = document.getElementById("username").value.trim().toUpperCase();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("login-msg");

  if (!username || !password) {
    msg.textContent = "Enter username and password";
    return;
  }

  msg.textContent = "Authenticating...";

  const url =
    `${API_URL}?action=login` +
    `&username=${encodeURIComponent(username)}` +
    `&password=${encodeURIComponent(password)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "SET_PASSWORD_REQUIRED") {
      await setPassword(username, password);
      return;
    }

    if (data.status === "SUCCESS") {
      localStorage.setItem(
        "lmsUser",
        JSON.stringify({
          username: data.username,
          role: data.role,
          subRole: data.subRole,
          loginTime: Date.now()
        })
      );

      window.location.href = "index.html";
      return;
    }

    msg.textContent = data.error || "Login failed";
  } catch (err) {
    msg.textContent = "Connection error";
  }
}

async function setPassword(username, password) {
  const msg = document.getElementById("login-msg");
  msg.textContent = "Setting password...";

  const url =
    `${API_URL}?action=setPassword` +
    `&username=${encodeURIComponent(username)}` +
    `&password=${encodeURIComponent(password)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "PASSWORD_SET") {
      msg.textContent = "Password set. Logging in...";
      setTimeout(login, 500);
    } else {
      msg.textContent = data.error || "Password setup failed";
    }
  } catch {
    msg.textContent = "Password setup error";
  }
}
