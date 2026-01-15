import { supabase } from "./supabase.js";

let currentUser = null;
const linksGrid = document.getElementById("linksGrid");
const premiumBadge = document.getElementById("premiumBadge");

// Check login
(async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = data.user;

  // Premium check
  const premium = currentUser.user_metadata?.premium;
  if (premium) {
    document.body.classList.add("premium");
    premiumBadge.textContent = "🌟 Premium";
  } else {
    premiumBadge.textContent = "";
  }

  fetchLinks();
})();

async function fetchLinks() {
  const { data: links, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    linksGrid.textContent = error.message;
    return;
  }

  linksGrid.innerHTML = "";
  links.forEach(link => {
    const card = document.createElement("div");
    card.className = "link-card";
    card.innerHTML = `
      <p>Original: ${link.original_url}</p>
      <p>Short: <a href="/r/${link.short_id}" target="_blank">${link.short_id}</a></p>
      <p>Clicks: ${link.clicks}</p>
      <button onclick="copyLink('${link.short_id}')">Copy</button>
      ${currentUser.user_metadata?.premium ? `<button onclick="deleteLink('${link.id}')">Delete</button>` : ""}
    `;
    linksGrid.appendChild(card);
  });
}

window.copyLink = (shortId) => {
  navigator.clipboard.writeText(`${window.location.origin}/r/${shortId}`);
  alert("Copied to clipboard!");
};

window.deleteLink = async (id) => {
  const { error } = await supabase.from("links").delete().eq("id", id);
  if (error) return alert(error.message);
  fetchLinks();
};

window.logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("premium");
  window.location.href = "index.html";
};
// hide premium button if user is already premium
if (currentUser.user_metadata?.premium) {
  const premiumSection = document.getElementById("premiumSection");
  if (premiumSection) premiumSection.style.display = "none";
}
