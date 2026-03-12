"use client";

import { useEffect, useMemo, useState } from "react";
import useAuthUser from "@/app/services/userService";
import { useRouter } from "next/navigation";
import {
  deleteCandidate,
  getCandidates,
  saveNote,
} from "../services/candidateService";
import { editCandidate } from "../services/candidateService";
import SearchBar from "../components/Searchbar";
import { getAllJobs } from "../services/jobService";
import { getAllCustomers } from "../services/costumerService";
import { getProfileByUser } from "../services/profileService";

export default function ActiveCandidates() {
  const user = useAuthUser();
  const router = useRouter();
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editStage, setEditStage] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");

  const [activeCandidate, setActiveCandidate] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");

  const stageColors: Record<string, string> = {
    applied: "border border-blue-400",
    screening: "border border-yellow-400",
    interview: "border border-purple-400",
    offer: "border border-green-400",
    hired: "border border-emerald-400",
    rejected: "border border-red-400",
  };

  const textColors: Record<string, string> = {
    applied: "text-blue-400",
    screening: "text-yellow-400",
    interview: "text-purple-400",
    offer: "text-green-400",
    hired: "text-emerald-400",
    rejected: "text-red-400",
  };

  function viewJob(jobId: string) {
    router.push(`/kanban/${jobId}`);
  }
  useEffect(() => {
    if (!user) return;

    fetchCandidates();
    fetchJobs();
    fetchCustomers();
    fetchProfile();
  }, [user]);

  async function fetchCandidates() {
    const data = await getCandidates();

    setAllCandidates(data);
  }

  async function fetchJobs() {
    const data = await getAllJobs();

    setJobs(data);
  }

  async function fetchCustomers() {
    const data = await getAllCustomers();
    setCustomers(data);
  }

  async function fetchProfile() {
    const data = await getProfileByUser(user);

    if (!data) return;

    setCustomerId(data.customer_id);
  }

  const jobMap = useMemo(
    () => Object.fromEntries(jobs.map((j) => [j.id, j])),
    [jobs],
  );

  const customerMap = useMemo(
    () => Object.fromEntries(customers.map((c) => [c.id, c])),
    [customers],
  );

  const filteredCandidates = allCandidates.filter((candidate) => {
    const job = jobMap[candidate.job_id];
    if (!job) return false;

    if (user?.role !== "admin" && customerId) {
      if (job.customer_id !== customerId) return false;
    }

    const candidateMatch = candidate.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const jobMatch = job.title?.toLowerCase().includes(search.toLowerCase());

    const customer = customerMap[job.customer_id];

    const customerMatch = customer?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return candidateMatch || jobMatch || customerMatch;
  });

  async function handleEditCandidate(candidateId: string) {
    const updated = await editCandidate(candidateId, {
      name: editName,
      stage: editStage,
      linkedin_url: editLinkedin,
    });

    setAllCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? updated : c)),
    );

    setEditingCandidate(null);
    setEditName("");
  }

  function startEdit(candidate: any) {
    setEditingCandidate(candidate.id);
    setEditName(candidate.name);
    setEditStage(candidate.stage);
    setEditLinkedin(candidate.linkedin_url);
  }

  async function handleSaveNote(candidateId: string, note: string) {
    await saveNote(candidateId, note);

    setAllCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, note } : c)),
    );

    setActiveCandidate(null);
    setNote("");
  }

  async function handleDeleteCandidate(candidateId: string) {
    const confirmed = confirm("Delete this candidate?");

    if (!confirmed) return;

    await deleteCandidate(candidateId);

    setAllCandidates((prev) =>
      prev.filter((candidate) => candidate.id !== candidateId),
    );
  }

  async function handleStageUpdate(candidateId: string, stage: string) {
    const updatedCandidate = await editCandidate(candidateId, { stage });
    setAllCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? updatedCandidate : c)),
    );
    setEditStage(stage);
  }

  return (
    <div className="p-10">
      <SearchBar search={search} setSearch={setSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCandidates.map((candidate) => {
          const job = jobMap[candidate.job_id];
          const customer = customerMap[job?.customer_id];

          return (
            <div
              key={candidate.id}
              className={`${stageColors[candidate.stage]} border-l-4 p-3 mb-3 rounded shadow`}
            >
              {editingCandidate !== candidate.id ? (
                <>
                  <h3
                    onClick={() => viewJob(job.id)}
                    className="cursor-pointer"
                  >
                    {candidate.name}
                  </h3>
                  <h4>{customer?.name || ""}</h4>

                  <p>{job?.title || ""}</p>
                  <h5 className={textColors[candidate.stage]}>
                    {candidate.stage}
                  </h5>
                  <a
                    href={candidate.linkedin_url}
                    target="_blank"
                    className="text-[#3fb950] text-sm"
                  >
                    LinkedIn
                  </a>
                  {activeCandidate !== candidate.id && (
                    <p
                      onDoubleClick={() => {
                        setActiveCandidate(candidate.id);
                        setNote(candidate.note || "");
                      }}
                      className={`cursor-pointer ${!candidate.note ? "text-gray-400 italic" : ""}`}
                    >
                      <b>Note:</b>{" "}
                      {candidate.note
                        ? candidate.note
                        : "Double click to add note"}
                    </p>
                  )}
                  {activeCandidate === candidate.id && (
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      onBlur={() => handleSaveNote(candidate.id, note)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSaveNote(candidate.id, note);
                        }

                        if (e.key === "Escape") {
                          setActiveCandidate(null);
                          setNote("");
                        }
                      }}
                      autoFocus
                      className="border p-2 w-full"
                    />
                  )}
                  <br />

                  <div className="flex justify-center">
                    <button onClick={() => startEdit(candidate)}>Edit</button>
                    <button onClick={() => handleDeleteCandidate(candidate.id)}>
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border p-1"
                  />
                  <select
                    value={
                      allCandidates.find((c) => c.id === candidate.id)?.stage ||
                      candidate.stage
                    }
                    onChange={(e) =>
                      handleStageUpdate(candidate.id, e.target.value)
                    }
                  >
                    <option value="applied">Applied</option>
                    <option value="screening">Screening</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <input
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    className="border p-1"
                  />
                  <button onClick={() => handleEditCandidate(candidate.id)}>
                    Save
                  </button>

                  <button onClick={() => setEditingCandidate(null)}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
