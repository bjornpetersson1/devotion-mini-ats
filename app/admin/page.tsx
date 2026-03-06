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
      <button onClick={() => router.push("/adminCreateCustomerProfile")}>
        Create Costumer
      </button>
      {/* <button onClick={() => alert("Not implemented yet")}>View Jobs</button>
      <button onClick={() => alert("Not implemented yet")}>
        View Candidates
      </button>
      <button onClick={() => alert("Not implemented yet")}>Add Job</button>
      <button onClick={() => alert("Not implemented yet")}>
        Add Candidate
      </button> */}
    </div>
  );
}
