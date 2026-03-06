"use client";
import { useState } from "react";

export default function AdminCreateCustomer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const createCustomer = async () => {
    const res = await fetch("/api/create-customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();

    if (data.error) setMessage(`Error: ${data.error}`);
    else setMessage(`Customer created: ${data.profile[0].username}`);
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
