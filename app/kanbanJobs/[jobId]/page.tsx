"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadKanban } from "../../services/kanbanService";

export default function JobKanban() {
  const params = useParams();
  const jobId = params.jobId;
  const [candidates, setCandidates] = useState<any[]>([]);
  const stages = ["applied", "screening", "interview", "offer", "hired"];

  useEffect(() => {
    async function fetchData() {
      const { candidates } = await loadKanban();
      setCandidates(candidates.filter((c) => c.job_id === jobId) || []);
    }
    fetchData();
  }, [jobId]);

  return (
    <div className="flex gap-6 overflow-x-auto p-6">
      {stages.map((stage) => (
        <div key={stage} className="min-w-[250px] bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-4">{stage}</h2>
          {candidates
            .filter((c) => c.stage === stage)
            .map((c) => (
              <div key={c.id} className="bg-white p-3 mb-3 rounded shadow">
                <p className="font-semibold">{c.name}</p>
                <a
                  href={c.linkedin_url}
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