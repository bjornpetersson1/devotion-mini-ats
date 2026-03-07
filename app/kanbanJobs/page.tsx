"use client";

import { useEffect, useState } from "react";
import { loadKanban } from "../services/kanbanService";
import { useRouter } from "next/navigation";
import getCurrentUser from "../services/userService";
import useAuthUser from "../services/userService";

export default function KanbanJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const router = useRouter();
  const user = useAuthUser();

  const stageColors: Record<string, string> = {
    applied: "bg-blue-100",
    screening: "bg-yellow-100",
    interview: "bg-purple-100",
    offer: "bg-green-100",
    hired: "bg-emerald-200",
    rejected: "bg-red-200",
  };
  function viewCandidates(jobId: string) {
    router.push(`/kanbanJobs/${jobId}`);
  }
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      const { jobs, candidates } = await loadKanban(user);
      setJobs(jobs || []);
      setCandidates(candidates || []);
    }

    fetchData();
  }, [user]);

  return (
    <div className="flex gap-6 overflow-x-auto p-6">
      {jobs.map((job) => (
        <div
          onClick={() => viewCandidates(job.id)}
          key={job.id}
          className="min-w-[250px] bg-gray-100 p-4 rounded"
        >
          <h2 className="font-bold mb-4">{job.title}</h2>

          {candidates
            .filter((c) => c.job_id === job.id)
            .map((candidate) => (
              <div
                key={candidate.id}
                className={`${stageColors[candidate.stage]} p-3 mb-3 rounded shadow`}
              >
                <p className="font-semibold">{candidate.name}</p>
                <p>{candidate.stage}</p>
                <a
                  href={candidate.linkedin_url}
                  target="_blank"
                  className="text-blue-500 text-sm"
                >
                  LinkedIn
                </a>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
