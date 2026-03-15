"use client";

import useAuthUser, {
  getCurrentCostumer,
  getCurrentProfile,
} from "@/app/services/userService";
import { useEffect, useState } from "react";
import Unauthorized from "../components/Unauthorized";

export default function UserStart() {
  const user = useAuthUser();
  const [costumer, setCostumer] = useState<any>(null);
  const [role, setRole] = useState("customer");

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      const profile = await getCurrentProfile(user);
      setRole(profile?.role === "user" ? "Customer" : "Admin");
      const costumer = await getCurrentCostumer(profile);
      setCostumer(costumer);
    }

    fetchData();
  }, [user]);
  if (role !== "Admin") {
    return (
      <h1 className="flex items-center justify-center h-screen text-3xl font-bold">
        Welcome back, {costumer?.name}
      </h1>
    );
  } else {
    return (
      <>
        <Unauthorized />
      </>
    );
  }
}
