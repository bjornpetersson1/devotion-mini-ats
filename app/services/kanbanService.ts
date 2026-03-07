import { supabase } from "@/lib/supabase";
import { loadJobs } from "./jobService";
import { loadCandidates } from "./candidateService";

export async function updateCandidateStage(candidateId: string, stage: string) {
  await supabase.from("candidates").update({ stage }).eq("id", candidateId);
}

export async function loadKanban(user: any) {
  const jobs = await loadJobs(user);

  const candidates = await loadCandidates();

  return { jobs, candidates };
}
