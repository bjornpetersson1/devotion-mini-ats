// import { supabase } from "@/lib/supabase";

// export default async function JobPage({
//   params,
// }: {
//   params: Promise<{ jobId: string }>;
// }) {
//   const { jobId } = await params;
//   const { data: candidates, error } = await supabase
//     .from("candidates")
//     .select("*")
//     .eq("job_id", jobId);

//   if (error) {
//     return <div>Error loading candidates</div>;
//   }

//   return (
//     <div>
//       <h1>Kandidater</h1>

//       {candidates?.map((c) => (
//         <div key={c.id}>
//           {c.name}, {c.linkedin_url}
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JobPageClient() {
  const params = useParams();
  const jobId = params.jobId;

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    async function fetchCandidates() {
      const { data } = await supabase
        .from("candidates")
        .select("*")
        .eq("job_id", jobId);
      if (data) setCandidates(data);
    }
    fetchCandidates();
  }, [jobId]);

  return (
    <div>
      <h1>Kandidater</h1>
      {candidates.map((c) => (
        <div key={c.id}>
          {c.name}, {c.linkedin_url}
        </div>
      ))}
    </div>
  );
}
