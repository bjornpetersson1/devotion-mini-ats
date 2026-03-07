"use client";

import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();

  return (
    <div className="p-10">
      <h1>Admin</h1>
      <button onClick={() => alert("Not implemented yet")}>
        View Costumers
      </button>
      <button onClick={() => router.push("/admin/adminCreateCustomerProfile")}>
        Create new user
      </button>
      <button onClick={() => router.push("/kanbanJobs")}>View Jobs</button>
    </div>
  );
}
