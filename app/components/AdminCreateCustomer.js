"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { insertCustomer } from "../services/costumerService";
import { updateProfile } from "../services/profileService";

export default function AdminCreateCustomer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const createCustomer = async () => {
    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const userData = await res.json();
      if (!userData.user) {
        setMessage(userData.error || "Failed to create user");
        return;
      }

      const profileId = userData.user.id;
      const customerData = await insertCustomer({ name });

      const customerId = customerData[0].id;

      await updateProfile({ id: profileId, customer_id: customerId });

      setMessage("Customer and profile linked successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Network or server error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1>Create Customer Profile</h1>
      <input
        type="text"
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <input
        type="email"
        placeholder="Customer Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={createCustomer}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Create Customer
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
