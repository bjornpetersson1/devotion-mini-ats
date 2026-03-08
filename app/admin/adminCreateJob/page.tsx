"use client";
import { useEffect, useState } from "react";
import { insertJob } from "../../services/jobService";
import { loadCustomers } from "../../services/costumerService";
import { useRouter } from "next/navigation";

export default function CreateJob() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");

  const handleCreateJob = async () => {
    setLoading(true);
    try {
      await insertJob({ title, description, customer_id: customerId });
    } catch (error) {
      console.error("Failed to create job", error);
    } finally {
      router.push("/admin");
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const customers = await loadCustomers();
      setCustomers(customers);
    };
    fetchData().then(() => setLoading(false));
  }, []);
  return (
    <div className={loading ? "cursor-wait" : ""}>
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
        onClick={() => handleCreateJob()}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Create Job
      </button>
    </div>
  );
}
