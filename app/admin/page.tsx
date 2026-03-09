"use client";

import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();

  return (
    <h1 className="flex items-center justify-center h-screen text-3xl font-bold">
      Welcome back, Admin
    </h1>
  );
}
