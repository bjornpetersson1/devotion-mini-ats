"use client";

import { useEffect, useState } from "react";
import { loadKanban } from "../services/kanbanService";

export default function KanbanJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const stageColors: Record<string, string> = {
    applied: "bg-blue-100",
    screening: "bg-yellow-100",
    interview: "bg-purple-100",
    offer: "bg-green-100",
    hired: "bg-emerald-200",
    rejected: "bg-red-200",
  };

  useEffect(() => {
    async function fetchData() {
      const { jobs, candidates } = await loadKanban();
      setJobs(jobs || []);
      setCandidates(candidates || []);
    }

    fetchData();
  }, []);

  return (
    <div className="flex gap-6 overflow-x-auto p-6">
      {jobs.map((job) => (
        <div key={job.id} className="min-w-[250px] bg-gray-100 p-4 rounded">
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
