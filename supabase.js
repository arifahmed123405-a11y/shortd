import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://aqfvwbsxxeyennfbuhrd.supabase.co";
const SUPABASE_KEY = "sb_publishable_GQR4fYRMQQqFvmLp4W5kVw_S7r0mn0C";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
