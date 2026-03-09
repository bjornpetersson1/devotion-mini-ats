"use client";

import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();

  return (
    <div className="p-10">
      <h1>Admin</h1>
      <button onClick={() => alert("Not implemented yet")}>
        View Candidates
      </button>
      <br />
      <button onClick={() => router.push("/admin/adminCreateCustomerProfile")}>
        Create new customer
      </button>
      <br />
      <button onClick={() => router.push("/admin/adminCreateJob")}>
        Create new job
      </button>
      <br />
      <button onClick={() => router.push("/admin/adminCreateCandidate")}>
        Create new candidate
      </button>
      <br />
      <button onClick={() => router.push("/kanbanJobs")}>View Jobs</button>
    </div>
  );
}
