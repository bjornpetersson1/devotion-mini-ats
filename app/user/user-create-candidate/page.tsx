"use client";
import { useEffect, useState } from "react";
import { insertCandidate } from "../../services/candidateService";
import { loadJobs } from "../../services/jobService";
import { useRouter } from "next/navigation";
import useAuthUser from "../../services/userService";
import { loadProfileById } from "@/app/services/profileService";
import Unauthorized from "@/app/components/Unauthorized";

export default function createCandidate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobId, setJobId] = useState("");
  const user = useAuthUser();
  const [role, setRole] = useState("customer");

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      if (!user) return;
      const data = await loadJobs(user);
      const profile = await loadProfileById(user.id);
      setRole(profile?.role === "user" ? "Customer" : "Admin");
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

  if (role !== "Admin") {
    return (
      <div className={loading ? "cursor-wait" : ""}>
        <div style={{ maxWidth: 400, margin: "50px auto" }}>
          <h1>New candidate</h1>
          <select value={jobId} onChange={(e) => setJobId(e.target.value)}>
            <option value="">Select job</option>

            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
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
          <button
            onClick={() => handleCreateCandidate()}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Create Candidate
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Unauthorized />
      </>
    );
  }
}
