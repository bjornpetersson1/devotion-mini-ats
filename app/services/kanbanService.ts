import { supabase } from "@/lib/supabase";
import { loadJobs } from "./jobService";
import { loadCandidates } from "./candidateService";


export async function updateCandidateStage(candidateId: string, stage: string) {
  await supabase
    .from("candidates")
    .update({ stage })
    .eq("id", candidateId);
}

export async function loadKanban() {
  const jobs = await loadJobs();

  const candidates = await loadCandidates();

  return { jobs, candidates };
}
