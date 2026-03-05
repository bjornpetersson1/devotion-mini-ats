import { supabase } from "../../lib/supabase";

export async function loadJobs() {
  const { data } = await supabase.from("jobs").select("*");
  return data || [];
}

export async function insertJob(job: { title: string; description: string }) {
  const { data, error } = await supabase.from("jobs").insert(job).select();

  if (error) {
    console.error("Error saving job:", error);
    throw error;
  }

  return data;
}
