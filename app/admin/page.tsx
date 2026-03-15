"use client";

import { useState, useEffect } from "react";
import { loadProfileById } from "../services/profileService";
import useAuthUser, { getCurrentCostumer } from "../services/userService";
import Unauthorized from "../components/Unauthorized";

export default function Admin() {
  const [role, setRole] = useState("customer");
  const user = useAuthUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const profile = await loadProfileById(user.id);
      setRole(profile?.role === "user" ? "Customer" : "Admin");
    };
    fetchData();
  }, [user]);

  if (role === "Admin") {
    return (
      <h1 className="flex items-center justify-center h-screen text-3xl font-bold">
        Welcome back, Admin
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
