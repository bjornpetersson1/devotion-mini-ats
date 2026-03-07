"use client";
import { useEffect, useState } from "react";
import { insertCandidate } from "../services/candidateService";
import { loadJobs } from "../services/jobService";
import getCurrentUser from "../services/userService";
import useAuthUser from "../services/userService";

export default function createCandidate() {
  const [name, setName] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobId, setJobId] = useState("");
  const user = useAuthUser();
  useEffect(() => {
    async function fetchJobs() {
      if (!user) return;
      const data = await loadJobs(user);
      setJobs(data);
    }

    fetchJobs();
  }, [user]);

  return (
    <div>
      <h1>Create Candidate</h1>
      <input
        type="text"
        placeholder="Candidate Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <input
        type="url"
        placeholder="LinkedIn Profile"
        value={linkedinUrl}
        onChange={(e) => setLinkedinUrl(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <select
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option value="">Select job</option>

        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title}
          </option>
        ))}
      </select>
      <button
        onClick={() =>
          insertCandidate({ name, linkedin_url: linkedinUrl, job_id: jobId })
        }
        className="bg-blue-500 text-white px-4 py-2"
      >
        Create Candidate
      </button>
    </div>
  );
}
