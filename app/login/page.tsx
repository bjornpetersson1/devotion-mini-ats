"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      console.error("Login error:", error.message);
      return;
    }

    const user = data.user;
    console.log("User logged in:", user);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError.message);
      setErrorMsg("Could not fetch profile, consider createing one.");
      return;
    }

    console.log("User profile:", profile);

    localStorage.setItem("userProfile", JSON.stringify(profile));
    if (profile.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/kanbanJobs");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1>Login</h1>
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
      <button onClick={login} style={{ width: "100%" }}>
        Login
      </button>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import { supabase } from "@/lib/supabase";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const login = async () => {
//     await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     console.log("User logged in");
//   };

//   return (
//     <div className="p-10">
//       <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />

//       <input
//         type="password"
//         placeholder="password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button onClick={login}>Login</button>
//     </div>
//   );
// }
