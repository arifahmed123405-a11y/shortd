import { supabase } from "../supabase.js";

(async () => {
  const path = window.location.pathname.split("/");
  const shortId = path[path.length - 1]; // grab last part of URL

  if (!shortId) return alert("Invalid short link!");

  const { data: link, error } = await supabase
    .from("links")
    .select("*")
    .eq("short_id", shortId)
    .single();

  if (error || !link) return alert("Link not found!");

  // increment clicks
  await supabase
    .from("links")
    .update({ clicks: link.clicks + 1 })
    .eq("id", link.id);

  // redirect
  window.location.href = link.original_url;
})();
