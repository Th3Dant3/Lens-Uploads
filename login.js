/**************************************************
 * CONFIG
 **************************************************/
const AUTH_API =
  "https://script.google.com/macros/s/AKfycbzESjnpNzOyDP76Gm6atwBgh5txV5N2AI225kxz5Q8w7jXgVTIqZrDtIIpQigEE6250/exec";

/**************************************************
 * FORCE USERNAME UPPERCASE
 **************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const userEl = document.getElementById("username");
  if (!userEl) return;

  userEl.addEventListener("input", () => {
    userEl.value = userEl.value.toUpperCase();
  });
});

/**************************************************
 * LOGIN
 **************************************************/
function login() {
  const usernameEl = document.getElementById("username");
  const passwordEl = document.getElementById("password");
  const messageEl = document.getElementById("message");

  const username = usernameEl.value.trim().toUpperCase();
  const password = passwordEl.value.trim();

  messageEl.textContent = "";
  messageEl.style.color = "#f87171";

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
    .catch(() => {
      messageEl.textContent = "Connection error";
    });
}

/**************************************************
 * HANDLE RESPONSE (UPDATED WITH VISIBILITY FETCH)
 **************************************************/
function handleLoginResponse(data, originalPassword) {
  const messageEl = document.getElementById("message");

  if (data.status === "ERROR") {
    messageEl.textContent = data.message;
    return;
  }

  if (data.status === "SET_PASSWORD_REQUIRED") {
    messageEl.style.color = "#fbbf24";
    messageEl.textContent = "First login — setting password…";
    setPassword(data.username, originalPassword);
    return;
  }

  if (data.status === "SUCCESS") {
    messageEl.style.color = "#6ee7b7";
    messageEl.textContent = "Login successful";

    // Store base session data
    sessionStorage.setItem("lms_logged_in", "true");
    sessionStorage.setItem("lms_user", data.username);
    sessionStorage.setItem("lms_role", data.role);

    // 🔥 Fetch visibility permissions
    fetch(
      `${AUTH_API}?action=visibility&username=${encodeURIComponent(data.username)}`
    )
      .then(res => res.json())
      .then(visData => {
        if (visData.status === "SUCCESS") {
          sessionStorage.setItem(
            "lms_visibility",
            JSON.stringify(visData.visibility)
          );
        } else {
          sessionStorage.setItem("lms_visibility", "{}");
        }

        // Redirect after permissions stored
        window.location.replace("index.html");
      })
      .catch(() => {
        // If visibility fails, still allow login but hide everything
        sessionStorage.setItem("lms_visibility", "{}");
        window.location.replace("index.html");
      });

    return;
  }
}


/**************************************************
 * SET PASSWORD (UPDATED WITH VISIBILITY FETCH)
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
        messageEl.textContent = "Password setup failed";
        return;
      }

      // Store base session info
      sessionStorage.setItem("lms_logged_in", "true");
      sessionStorage.setItem("lms_user", username);

      // 🔥 Fetch visibility permissions
      fetch(
        `${AUTH_API}?action=visibility&username=${encodeURIComponent(username)}`
      )
        .then(res => res.json())
        .then(visData => {
          if (visData.status === "SUCCESS") {
            sessionStorage.setItem(
              "lms_visibility",
              JSON.stringify(visData.visibility)
            );
          } else {
            sessionStorage.setItem("lms_visibility", "{}");
          }

          window.location.replace("index.html");
        })
        .catch(() => {
          // If visibility fails, hide everything
          sessionStorage.setItem("lms_visibility", "{}");
          window.location.replace("index.html");
        });
    })
    .catch(() => {
      messageEl.textContent = "Password setup failed";
    });
}


/**************************************************
 * ENTER KEY
 **************************************************/
document.addEventListener("keydown", e => {
  if (e.key === "Enter") login();
});
