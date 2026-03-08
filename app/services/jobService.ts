import { supabase } from "../../lib/supabase";
import { loadProfileById } from "./profileService";

export async function loadJobs(user: any) {
  if (!user) {
    console.warn("No user logged in yet");
    return [];
  }

  // Hämta profilen
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, customer_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("Failed to fetch profile:", profileError);
    return [];
  }

  console.log("Current profile:", profile);

  if (profile.role === "admin") {
    // Admin ser alla jobb
    const { data: jobs, error } = await supabase.from("jobs").select("*");
    if (error) {
      console.error("Failed to fetch jobs:", error);
      return [];
    }
    return jobs || [];
  } else {
    if (!profile.customer_id) {
      console.warn("User has no customer_id assigned:", profile);
      return [];
    }

    const { data: jobs, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("customer_id", profile.customer_id);

    if (error) {
      console.error("Failed to fetch jobs for user:", error);
      return [];
    }

    console.log("Jobs for user:", jobs);
    return jobs || [];
  }
}

export async function insertJob(job: {
  title: string;
  description: string;
  customer_id: string;
}) {
  const { data, error } = await supabase.from("jobs").insert(job).select();

  if (error) {
    console.error("Error saving job:", error);
    throw error;
  }

  return data;
}
export async function getJobById(jobId: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error) {
    console.error("Error fetching job:", error);
    throw error;
  }

  return data;
}

export async function getJobsByCustomerId(CustomerId: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("customer_id", CustomerId);

  if (error) {
    console.error("Error fetching jobs for customer:", error);
    return [];
  }

  return data;
}
