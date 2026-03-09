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
    <h1 className="flex items-center justify-center h-screen text-3xl font-bold">
      Welcome back, {costumer?.name}
    </h1>
  );
}
