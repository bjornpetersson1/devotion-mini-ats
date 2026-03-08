"use client";
import { useEffect, useState } from "react";
import useAuthUser, { getCurrentCostumer } from "../../services/userService";
import { loadProfileById } from "../../services/profileService";
import { useRouter } from "next/navigation";
import "./TopBar.css";

export default function TopBar() {
  const router = useRouter();
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
      } else {
        setName("Admin");
      }
    };
    fetchData();
  }, [user]);
  if (name === "Admin") {
    return (
      <div className="TopBar">
        <h3>{role}</h3>
        <h1 onClick={() => router.push("/admin")}>{name}</h1>
        <div className="buttons">
          <button onClick={() => router.push("/admin/adminCustomers")}>
            Customers
          </button>
          <button
            onClick={() => router.push("/admin/adminCreateCustomerProfile")}
          >
            Create new user
          </button>
          <button onClick={() => router.push("/admin/adminCreateJob")}>
            Create new job
          </button>
          <button onClick={() => router.push("/admin/adminCreateCandidate")}>
            Create new candidate
          </button>
          <button onClick={() => router.push("/kanbanJobs")}>
            View all jobs
          </button>
          <button onClick={() => router.push("/")}>Sign out</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="TopBar">
        <h3>{role}</h3>
        <h1 onClick={() => router.push("/user")}>{name}</h1>
        <div className="buttons">
        <button onClick={() => router.push("/createCandidate")}>
          Create candidate
        </button>
        <button onClick={() => router.push("/createJob")}>
          Create new job
        </button>
        <button onClick={() => router.push("/kanbanJobs")}>View jobs</button>
        <button onClick={() => router.push("/")}>Sign out</button>
        </div>
      </div>
    );
  }
}
