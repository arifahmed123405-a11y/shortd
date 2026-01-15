import { supabase } from "./supabase.js";

const userArea = document.getElementById("userArea");

async function renderUser() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    // Not logged in → show login form
    userArea.innerHTML = `
      <input id="email" type="email" placeholder="Email">
      <input id="password" type="password" placeholder="Password">
      <button id="loginBtn">Login</button>
      <button id="signupBtn">Signup</button>
    `;

    document.getElementById("loginBtn").onclick = async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      });
      if (error) return alert(error.message);
      renderUser(); // refresh topnav after login
    };

    document.getElementById("signupBtn").onclick = async () => {
      const { error } = await supabase.auth.signUp({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      });
      if (error) return alert(error.message);
      alert("Signup success! Verify your email before login.");
    };

  } else {
    // Logged in → show profile dropdown
    const user = data.user;
    const avatar = user.user_metadata?.avatar_url || "https://i.pravatar.cc/40";

    userArea.innerHTML = `
      <div class="profile-dropdown">
        <img src="${avatar}" alt="Profile">
        <div class="menu">
          <p>${user.email}</p>
          <button onclick="window.location.href='dashboard.html'">Dashboard</button>
          <button onclick="logout()">Logout</button>
        </div>
      </div>
    `;

    if (user.user_metadata?.premium) document.body.classList.add("premium");
  }
}

window.logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("premium");
  renderUser();
};

renderUser();
