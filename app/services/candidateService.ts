import { supabase } from "../../lib/supabase";

export async function getCandidates() {
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
}

export async function deleteCandidate(candidateId: string) {
  const { data, error } = await supabase
    .from("candidates")
    .delete()
    .eq("id", candidateId);

  if (error) {
    console.error(error);
  }

  return data;
}

export async function insertCandidate(candidate: {
  name: string;
  //email: string;
  linkedin_url: string;
  job_id: string;
}) {
  const { data, error } = await supabase
    .from("candidates")
    .insert(candidate)
    .select();

  if (error) {
    console.error("Error saving job:", error);
    throw error;
  }

  return data;
}
export async function updateCandidate(candidate: {
  id: string;
  name?: string;
  stage?: string;
}) {
  const { id, ...updates } = candidate;

  await supabase.from("candidates").update(updates).eq("id", id);
}
export async function editCandidate(candidateId: string, updates: any) {
  const { data, error } = await supabase
    .from("candidates")
    .update(updates)
    .eq("id", candidateId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function saveNote(candidateId: string, note: string) {
  const { error } = await supabase
    .from("candidates")
    .update({ note })
    .eq("id", candidateId);

  if (error) {
    console.error(error);
    return;
  }
}

// export async function updateCandidateNote(id: string, note: string) {
//   const { error } = await supabase
//     .from("candidates")
//     .update({ note })
//     .eq("id", id);

//   if (error) throw error;
// }
