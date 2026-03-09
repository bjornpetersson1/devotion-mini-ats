"use client";
import { useEffect, useState } from "react";
import { insertJob } from "../../services/jobService";
import useAuthUser, { getCurrentProfile } from "../../services/userService";
import { useRouter } from "next/navigation";
export default function CreateJob() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [customerId, setCustomerId] = useState("");
  const user = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!user) return;
      const profile = await getCurrentProfile(user);
      setCustomerId(profile?.customer_id || "");
    };
    fetchData().then(() => setLoading(false));
  }, [user]);
  const handleCreateJob = async () => {
    setLoading(true);
    try {
      await insertJob({ title, description, customer_id: customerId });
    } catch (error) {
      console.error("Failed to create job", error);
    } finally {
      router.push("/user");
      setLoading(false);
    }
  };
  return (
    <div className={loading ? "cursor-wait" : ""}>
      <div style={{ maxWidth: 400, margin: "50px auto" }}>
        <h1>New job</h1>
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
    </div>
  );
}
