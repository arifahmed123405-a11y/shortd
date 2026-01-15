import { supabase } from "./supabase.js";

let currentUser = null;
const resultText = document.getElementById("result");

(async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    window.location.href = "index.html";
    return;
  }
  currentUser = data.user;
})();

function generateRandomId(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i=0;i<length;i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

window.createLink = async () => {
  const originalUrl = document.getElementById("originalUrl").value.trim();
  let shortId = document.getElementById("customId").value.trim();

  if (!originalUrl) return alert("Enter a URL");

  const isPremium = currentUser.user_metadata?.premium;

  if (shortId && !isPremium) {
    alert("Custom alias is for premium users only");
    return;
  }

  if (!shortId) shortId = generateRandomId();

  const { error } = await supabase.from("links").insert({
    user_id: currentUser.id,
    original_url: originalUrl,
    short_id: shortId
  });

  if (error) return alert(error.message);

  resultText.innerHTML = `✅ Short link created: <a href="/r/${shortId}" target="_blank">${shortId}</a>`;
};
