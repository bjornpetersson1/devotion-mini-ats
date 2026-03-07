import { supabase } from "../../lib/supabase";

export async function loadProfiles() {
  const { data } = await supabase.from("profiles").select("*");
  return data || [];
}

export async function loadProfileById(id: string) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  return data || [];
}

export async function insertProfile(profile: { email: string }) {
  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select();

  if (error) {
    console.error("Error saving profile:", error);
    throw error;
  }

  return data;
}
export async function updateProfile(profile: {
  id: string;
  email?: string;
  role?: string;
  customer_id?: string;
}) {
  const { id, ...updates } = profile;

  //   await supabase.from("profiles").update(updates).eq("id", id);
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Failed to update profile:", error.message);
    throw error; // kasta vidare så frontend får veta det
  }

  return data;
}
