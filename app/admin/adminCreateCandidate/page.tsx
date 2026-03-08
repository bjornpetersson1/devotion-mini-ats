"use client";
import { use, useEffect, useState } from "react";
import { insertCandidate } from "../../services/candidateService";
import { getJobsByCustomerId, loadJobs } from "../../services/jobService";
import useAuthUser from "../../services/userService";
import { loadCustomers } from "@/app/services/costumerService";
import { useRouter } from "next/navigation";

export default function createCandidate() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobId, setJobId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const user = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      const data = await loadCustomers();
      setCustomers(data);
    }
    fetchCustomers().then(() => setLoading(false));
  }, []);
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const data = await getJobsByCustomerId(customerId);
      setJobs(data);
    }
    fetchJobs().then(() => setLoading(false));
  }, [customerId]);

  const handleCreateCandidate = async () => {
    setLoading(true);
    try {
      await insertCandidate({ name, linkedin_url: linkedinUrl, job_id: jobId });
    } catch (error) {
      console.error("Failed to create candidate", error);
    } finally {
      router.push("/admin");
      setLoading(false);
    }
  };
  return (
    <div className={loading ? "cursor-wait" : ""}>
      <h1>Create Candidate</h1>
      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      >
        <option value="">Select customer</option>

        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
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
  );
}
