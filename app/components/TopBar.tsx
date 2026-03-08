"use client";
import { useEffect, useState } from "react";
import useAuthUser, { getCurrentCostumer } from "../services/userService";
import { loadProfileById } from "../services/profileService";

export default function TopBar() {
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const user = useAuthUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const profile = await loadProfileById(user.id);
      setRole(profile?.role === "user" ? "Customer" : "Admin");
      if (profile?.role === "user") {
        const customer = await getCurrentCostumer(profile);
        setName(customer?.name || "");
      }
    };
    fetchData();
  }, [user]);
  return (
    <div>
      <h3>{role}</h3>
      <h1>{name}</h1>
    </div>
  );
}
