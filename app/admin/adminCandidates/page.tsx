"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { loadCustomers } from "@/app/services/costumerService";

export default function AdminCustomer() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const jobMap = Object.fromEntries(jobs.map((j) => [j.id, j]));
  const customerMap = Object.fromEntries(customers.map((c) => [c.id, c]));

  const stageColors: Record<string, string> = {
    applied: "border border-blue-400",
    screening: "border border-yellow-400",
    interview: "border border-purple-400",
    offer: "border border-green-400",
    hired: "border border-emerald-400",
    rejected: "border border-red-400",
  };

  const textColors: Record<string, string> = {
    applied: "text-blue-400",
    screening: "text-yellow-400",
    interview: "text-purple-400",
    offer: "text-green-400",
    hired: "text-emerald-400",
    rejected: "text-red-400",
  };

  useEffect(() => {
    fetchCandidates();
    fetchJobs();
    fetchCustomers();
  }, []);

  async function fetchCandidates() {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setCandidates(data);
  }
  async function fetchJobs() {
    const { data, error } = await supabase.from("jobs").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setJobs(data);
  }
  async function fetchCustomers() {
    const { data, error } = await supabase.from("customers").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setCustomers(data);
  }

  async function saveNote(candidateId: string) {
    const { error } = await supabase
      .from("candidates")
      .update({ note })
      .eq("id", candidateId);

    if (error) {
      console.error(error);
      return;
    }

    setActiveCandidate(null);
    setNote("");
    fetchCandidates();
  }

  return (
    <div className="p-10">
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔎 Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full max-w-md mx-auto block"
        />
      </div>
      <h1>Candidates</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {candidates
          .filter((candidate) => {
            const candidateNameMatch = candidate.name
              .toLowerCase()
              .includes(search.toLowerCase());

            const job = jobMap[candidate.job_id];
            const jobMatch = job?.title
              .toLowerCase()
              .includes(search.toLowerCase());

            const customer = customerMap[job?.customer_id || ""];
            const customerMatch = customer?.name
              .toLowerCase()
              .includes(search.toLowerCase());

            return candidateNameMatch || jobMatch || customerMatch;
          })
          .map((candidate) => (
            <div
              key={candidate.id}
              className={`${stageColors[candidate.stage]} border-l-4 p-3 mb-3 rounded shadow`}
            >
              <h3>{candidate.name}</h3>
              <h4>
                {customerMap[jobMap[candidate.job_id]?.customer_id]?.name || ""}
              </h4>
              <p>
                {jobs.find((job) => job.id === candidate.job_id)?.title || ""}
              </p>
              <h5 className={textColors[candidate.stage]}>{candidate.stage}</h5>
              <a
                href={candidate.linkedin_url}
                target="_blank"
                className="text-[#3fb950] text-sm"
              >
                LinkedIn
              </a>
              <br />
              {candidate.note && (
                <p>
                  <b>Note:</b> {candidate.note}
                </p>
              )}

              <button onClick={() => setActiveCandidate(candidate.id)}>
                Add note
              </button>

              {activeCandidate === candidate.id && (
                <div style={{ marginTop: "10px" }}>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write note..."
                  />

                  <br />

                  <button onClick={() => saveNote(candidate.id)}>Save</button>
                  <button onClick={() => setActiveCandidate(null)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
