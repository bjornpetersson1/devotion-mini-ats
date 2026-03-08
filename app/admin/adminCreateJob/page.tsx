"use client";
import { useEffect, useState } from "react";
import { insertJob } from "../../services/jobService";
import { loadCustomers } from "../../services/costumerService";
import useAuthUser, { getCurrentProfile } from "../../services/userService";

export default function CreateJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const customers = await loadCustomers();
      setCustomers(customers);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Create Job for Customer</h1>
      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option value="">Select Customer</option>

        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <textarea
        placeholder="Job Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mb-4"
      ></textarea>
      <button
        onClick={() =>
          insertJob({ title, description, customer_id: customerId })
        }
        className="bg-blue-500 text-white px-4 py-2"
      >
        Create Job
      </button>
    </div>
  );
}
