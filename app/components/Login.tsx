"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { logIn } from "../services/userService";
import { getProfileByUser } from "../services/profileService";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogIn = async () => {
    const data = await logIn(email, password, setErrorMsg);
    const profile = await getProfileByUser(data);

    if (!profile) {
      setErrorMsg("Could not fetch profile, consider createing one.");
      return;
    }

    localStorage.setItem("userProfile", JSON.stringify(profile));

    if (profile.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1 className="text-center text-3xl font-bold">Mini-ATS</h1>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10 }}
      />
      <button onClick={handleLogIn} style={{ width: "100%" }}>
        Login
      </button>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </div>
  );
}
