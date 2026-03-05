import { supabase } from "@/lib/supabase";
import { loadJobs } from "./jobService";
import { loadCandidates } from "./candidateService";

export async function loadKanban() {
  const jobs = await loadJobs();

  const candidates = await loadCandidates();

  return { jobs, candidates };
}
