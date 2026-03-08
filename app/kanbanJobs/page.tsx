"use client";

import { useEffect, useState } from "react";
import { loadKanban } from "../services/kanbanService";
import { useRouter } from "next/navigation";
import getCurrentUser, {
  getCurrentCostumer,
  getCurrentProfile,
} from "../services/userService";
import useAuthUser from "../services/userService";
import { supabase } from "@/lib/supabase";

export default function KanbanJobs() {
  const [search, setSearch] = useState("");
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
      const customerIds = jobs
        .map((j) => j.customer_id)
        .filter((id) => id != null);
      const { data: customers } = await supabase
        .from("customers")
        .select("*")
        .in("id", customerIds);
      const jobsWithCustomer = jobs.map((job) => {
        const customer = customers?.find((c) => c.id === job.customer_id);
        return { ...job, customer };
      });
      setJobs(jobsWithCustomer || []);
      setCandidates(candidates || []);
    }

    fetchData();
  }, [user]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔎 Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="flex gap-6 overflow-x-auto p-6">
        {jobs
          .filter((job) => {
            const jobMatch = job.title
              .toLowerCase()
              .includes(search.toLowerCase());

            const customerMatch = job.customer?.name
              ?.toLowerCase()
              .includes(search.toLowerCase());

            const candidateMatch = candidates.some(
              (c) =>
                c.job_id === job.id &&
                c.name.toLowerCase().includes(search.toLowerCase()),
            );

            return jobMatch || customerMatch || candidateMatch;
          })
          .map((job) => (
            <div
              onClick={() => viewCandidates(job.id)}
              key={job.id}
              className="candidateCard min-w-[250px] bg-gray-100 p-4 rounded"
            >
              <h2 className="font-bold mb-4">{job.title}</h2>
              <h3>{job.customer?.name}</h3>

              {candidates
                .filter((c) => c.job_id === job.id)
                .filter((c) =>
                  c.name.toLowerCase().includes(search.toLowerCase()),
                )
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
    </div>
  );
}
