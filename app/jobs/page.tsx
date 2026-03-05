"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const router = useRouter();
  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    const { data } = await supabase.from("jobs").select("*");

    setJobs(data || []);
  }

  function viewCandidates(jobId: string) {
    router.push(`/jobs/${jobId}`);
  }

  return (
    <div className="p-10">
      <h1>Jobs</h1>

      {jobs.map((job: any) => (
        <div key={job.id}>
          {job.id}: {job.title}{" "}
          <button onClick={() => viewCandidates(job.id)}>
            View Candidates
          </button>
        </div>
      ))}
    </div>
  );
}
