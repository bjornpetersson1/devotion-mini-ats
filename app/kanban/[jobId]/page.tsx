"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadKanban, updateCandidateStage } from "../../services/kanbanService";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import useAuthUser from "@/app/services/userService";
import { getJobById, updateJobById } from "@/app/services/jobService";

function DraggableCandidate({ candidate, color }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: candidate.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 mb-3 rounded shadow cursor-move ${color}`}
    >
      <p className="font-semibold">{candidate.name}</p>
      <a
        href={candidate.linkedin_url}
        target="_blank"
        className="text-[#3fb950] text-sm"
      >
        LinkedIn
      </a>
    </div>
  );
}

function DroppableStage({ stage, children, className }: any) {
  const { setNodeRef } = useDroppable({
    id: stage,
  });

  return (
    <div ref={setNodeRef} className={className}>
      <h2>{stage}</h2>
      {children}
    </div>
  );
}

export default function JobKanban() {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const jobId = params.jobId;
  const [candidates, setCandidates] = useState<any[]>([]);
  const [job, setJob] = useState<any>(null);
  const [editNameMode, setEditNameMode] = useState<boolean>(false);
  const [editDescriptionMode, setEditDescriptionMode] =
    useState<boolean>(false);
  const [jobName, setJobName] = useState<string>();
  const [jobDescription, setJobDescription] = useState<string>();
  const user = useAuthUser();

  const stages = [
    "applied",
    "screening",
    "interview",
    "offer",
    "hired",
    "rejected",
  ];

  const stageColors: Record<string, string> = {
    applied: "border border-blue-400",
    screening: "border border-yellow-400",
    interview: "border border-purple-400",
    offer: "border border-green-400",
    hired: "border border-emerald-400",
    rejected: "border border-red-400",
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const candidateId = active.id;
    const newStage = over.id;

    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c)),
    );

    await updateCandidateStage(candidateId, newStage);
  };
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (!user) return;
      const { candidates } = await loadKanban(user);
      setCandidates(candidates.filter((c) => c.job_id === jobId) || []);
      const currentJob = await getJobById(String(jobId));
      setJob(currentJob);
    }
    fetchData().then(() => setLoading(false));
  }, [jobId, user]);

  async function handleNewName(newName: string) {
    await updateJobById({ id: String(jobId), title: newName });
    setJob((prev: any) => ({
      ...prev,
      title: newName,
    }));
    setEditNameMode(false);
  }

  async function handleNewDescription(newDescription: string) {
    await updateJobById({ id: String(jobId), description: newDescription });
    setJob((prev: any) => ({
      ...prev,
      description: newDescription,
    }));
    setEditDescriptionMode(false);
  }
  return (
    <div className={loading ? "cursor-wait" : ""}>
      <DndContext onDragEnd={handleDragEnd}>
        {!editNameMode && (
          <h2
            onDoubleClick={() => {
              setEditNameMode(true);
              setJobName(job?.title);
            }}
            className="text-center text-3xl font-bold cursor-pointer"
          >
            {job?.title}
          </h2>
        )}
        {editNameMode && (
          <textarea
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            onBlur={() => jobName && handleNewName(jobName)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                jobName && handleNewName(jobName);
              }

              if (e.key === "Escape") {
                setEditNameMode(false);
                setJobName("");
              }
            }}
            autoFocus
            className="border p-2 w-full text-center text-3xl font-bold"
          />
        )}
        <div className="flex justify-center">
          <div className="flex gap-2 overflow-x-auto p-6">
            {stages.map((stage) => (
              <DroppableStage
                key={stage}
                stage={stage}
                className="candidateCard"
              >
                {candidates
                  .filter((c) => c.stage === stage)
                  .map((c) => (
                    <DraggableCandidate
                      key={c.id}
                      candidate={c}
                      color={`${stageColors[c.stage]} border-l-4 p-3 mb-3 rounded shadow bg-[#30363d]`}
                    />
                  ))}
              </DroppableStage>
            ))}
          </div>
        </div>
        {/* <p className="text-center ">{job?.description}</p> */}
        {!editDescriptionMode && (
          <p
            onDoubleClick={() => {
              setEditDescriptionMode(true);
              setJobDescription(job?.description);
            }}
            className="text-center cursor-pointer"
          >
            {job?.description}
          </p>
        )}
        {editDescriptionMode && (
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            onBlur={() =>
              jobDescription && handleNewDescription(jobDescription)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                jobDescription && handleNewDescription(jobDescription);
              }

              if (e.key === "Escape") {
                setEditNameMode(false);
                setJobDescription("");
              }
            }}
            autoFocus
            className="border p-2 w-full text-center"
          />
        )}
      </DndContext>
    </div>
  );
}
