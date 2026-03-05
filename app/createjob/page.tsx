"use client";
import { useState } from "react";
import { insertJob } from "../services/jobService";

export default function CreateJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
        onClick={() => insertJob({ title, description })}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Create Job
      </button>
    </div>
  );
}
