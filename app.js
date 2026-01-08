// Simple front-end "login gate" for GitHub Pages (NOT true security).
const AUTH_KEY = "lensUploads_authed";
const PASS_HASH_KEY = "lensUploads_pass"; // optional: store your chosen password in localStorage

function getSavedPassword() {
  return localStorage.getItem(PASS_HASH_KEY) || "zenni123"; // change default
}

function isAuthed() {
  return localStorage.getItem(AUTH_KEY) === "1";
}

function requireAuth() {
  if (!isAuthed()) window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = "index.html";
}

function loginWithPassword(inputPass) {
  const correct = getSavedPassword();
  if (inputPass === correct) {
    localStorage.setItem(AUTH_KEY, "1");
    return true;
  }
  return false;
}
