"use client";

import useAuthUser, {
  getCurrentCostumer,
  getCurrentProfile,
} from "@/app/services/userService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserStart() {
  const router = useRouter();
  const user = useAuthUser();
  const [costumer, setCostumer] = useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      const profile = await getCurrentProfile(user);
      const costumer = await getCurrentCostumer(profile);
      setCostumer(costumer);
    }

    fetchData();
  }, [user]);
  return (
    <div className="p-10">
      <h1>Welcome back, {costumer?.name}</h1>
      <button onClick={() => router.push("/createCandidate")}>
        Create candidate
      </button>
      <button onClick={() => router.push("/createJob")}>Create new job</button>
      <button onClick={() => router.push("/kanbanJobs")}>View jobs</button>
    </div>
  );
}
