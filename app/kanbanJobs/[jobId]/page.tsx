"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loadKanban, updateCandidateStage } from "../../services/kanbanService";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import getCurrentUser from "@/app/services/userService";
import useAuthUser from "@/app/services/userService";
import { getJobById } from "@/app/services/jobService";

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
        className="text-blue-500 text-sm"
      >
        LinkedIn
      </a>
    </div>
  );
}

function DroppableStage({ stage, children }: any) {
  const { setNodeRef } = useDroppable({
    id: stage,
  });

  return (
    <div ref={setNodeRef} className="min-w-[250px] bg-gray-100 p-4 rounded">
      <h2 className="font-bold mb-4">{stage}</h2>
      {children}
    </div>
  );
}

export default function JobKanban() {
  const params = useParams();
  const jobId = params.jobId;
  const [candidates, setCandidates] = useState<any[]>([]);
  const [job, setJob] = useState<any>(null);
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
    applied: "bg-blue-100",
    screening: "bg-yellow-100",
    interview: "bg-purple-100",
    offer: "bg-green-100",
    hired: "bg-emerald-200",
    rejected: "bg-red-200",
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
      if (!user) return;
      const { candidates } = await loadKanban(user);
      setCandidates(candidates.filter((c) => c.job_id === jobId) || []);
      const currentJob = await getJobById(String(jobId));
      setJob(currentJob);
    }
    fetchData();
  }, [jobId, user]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <h2>{job?.title}</h2>
      <div className="flex gap-2 overflow-x-auto p-6">
        {stages.map((stage) => (
          <DroppableStage key={stage} stage={stage}>
            {candidates
              .filter((c) => c.stage === stage)
              .map((c) => (
                <DraggableCandidate
                  key={c.id}
                  candidate={c}
                  color={stageColors[c.stage]}
                />
              ))}
          </DroppableStage>
        ))}
      </div>
      <h2>{job?.description}</h2>
    </DndContext>
  );
}
