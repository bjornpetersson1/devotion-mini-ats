"use client";
import { useEffect, useState } from "react";
import { insertJob } from "../services/jobService";
import useAuthUser, { getCurrentProfile } from "../services/userService";

export default function CreateJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customerId, setCustomerId] = useState("");
  const user = useAuthUser();
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const profile = await getCurrentProfile(user);
      setCustomerId(profile?.customer_id || "");
    };
    fetchData();
  }, [user]);
  const profile = getCurrentProfile(user);
  return (
    <div>
      <h1>Create Job</h1>
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
