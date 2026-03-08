"use client";
import { useEffect, useState } from "react";
import { insertCandidate } from "../services/candidateService";
import { loadJobs } from "../services/jobService";
import { useRouter } from "next/navigation";
import useAuthUser from "../services/userService";

export default function createCandidate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobId, setJobId] = useState("");
  const user = useAuthUser();
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      if (!user) return;
      const data = await loadJobs(user);
      setJobs(data);
    }

    fetchJobs().then(() => setLoading(false));
  }, [user]);

  const handleCreateCandidate = async () => {
    setLoading(true);
    try {
      await insertCandidate({ name, linkedin_url: linkedinUrl, job_id: jobId });
    } catch (error) {
      console.error("Failed to create candidate", error);
    } finally {
      router.push("/user");
      setLoading(false);
    }
  };

  return (
    <div className={loading ? "cursor-wait" : ""}>
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
      <select value={jobId} onChange={(e) => setJobId(e.target.value)}>
        <option value="">Select job</option>

        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title}
          </option>
        ))}
      </select>
      <button
        onClick={() => handleCreateCandidate()}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Create Candidate
      </button>
    </div>
  );
}
