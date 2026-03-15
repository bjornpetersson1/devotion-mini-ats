"use client";
import { useState } from "react";
import { insertCustomer } from "../services/costumerService";
import { updateProfile } from "../services/profileService";
import { useRouter } from "next/navigation";
import Unauthorized from "./Unauthorized";

export default function AdminCreateUser() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const router = useRouter();

  const createCustomer = async () => {
    setLoading(true);
    try {
      const body =
        role === "admin"
          ? { email: email.trim(), role }
          : { email: email.trim(), role, name: name.trim() };

      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const userData = await res.json();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      if (role !== "admin") {
        const profileId = userData.user.id;

        const customerData = await insertCustomer({ name });

        const customerId = customerData[0].id;

        await updateProfile({ id: profileId, customer_id: customerId });
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  async function handleCreateCustomer() {
    try {
      await createCustomer();
      router.push("/admin");
    } catch (error) {
      console.error("Failed to create customer", error);
    }
  }

  if (role === "admin") {
    return (
      <div className={loading ? "cursor-wait" : ""}>
        <div style={{ maxWidth: 400, margin: "50px auto" }}>
          <h1>New user</h1>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 w-full mb-4"
          >
            <option value="user">Customer</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="text"
            placeholder="Customer Name"
            value={role === "admin" ? "" : name}
            disabled={role === "admin"}
            onChange={(e) => setName(e.target.value)}
            className={`border p-2 w-full mb-4 ${
              role === "admin" ? "bg-gray-200" : ""
            }`}
          />
          <input
            type="email"
            placeholder="Customer/Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-4"
          />
          <button
            onClick={handleCreateCustomer}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Create Customer
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <Unauthorized />
      </>
    );
  }
}
