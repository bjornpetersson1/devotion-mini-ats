"use client";

import { useEffect, useState } from "react";
import { loadKanban } from "../services/kanbanService";
import { useRouter } from "next/navigation";
import useAuthUser from "../services/userService";
import SearchBar from "../components/Searchbar";
import { getCustomersByIds } from "../services/costumerService";

export default function KanbanJobs() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const router = useRouter();
  const user = useAuthUser();

  const stageColors: Record<string, string> = {
    applied: "border border-blue-400",
    screening: "border border-yellow-400",
    interview: "border border-purple-400",
    offer: "border border-green-400",
    hired: "border border-emerald-400",
    rejected: "border border-red-400",
  };
  function viewCandidates(jobId: string) {
    router.push(`/kanban/${jobId}`);
  }
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (!user) return;
      const { jobs, candidates } = await loadKanban(user);
      const customerIds = jobs
        .map((j) => j.customer_id)
        .filter((id) => id != null);
      const customers = await getCustomersByIds(customerIds);
      const jobsWithCustomer = jobs.map((job) => {
        const customer = customers?.find((c) => c.id === job.customer_id);
        return { ...job, customer };
      });
      setJobs(jobsWithCustomer || []);
      setCandidates(candidates || []);
    }

    fetchData().then(() => setLoading(false));
  }, [user]);

  return (
    <div className={loading ? "cursor-wait" : ""}>
      <SearchBar search={search} setSearch={setSearch} />

      <div className="flex justify-center">
        <div className="flex gap-6 overflow-x-auto p-6 rounded-xl shadow-inner">
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
                className="candidateCard"
              >
                <h2>{job.title}</h2>
                <h3>{job.customer?.name}</h3>

                {candidates
                  .filter((c) => c.job_id === job.id)
                  .filter((c) =>
                    c.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((candidate) => (
                    <div
                      key={candidate.id}
                      className={`${stageColors[candidate.stage]} border-l-4 p-3 mb-3 rounded shadow`}
                    >
                      <p className="font-semibold">{candidate.name}</p>
                      <p>{candidate.stage}</p>
                      <a
                        href={candidate.linkedin_url}
                        target="_blank"
                        className="text-[#3fb950] text-sm"
                      >
                        LinkedIn
                      </a>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
