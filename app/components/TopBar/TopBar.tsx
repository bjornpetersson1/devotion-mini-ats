"use client";
import { useEffect, useRef, useState } from "react";
import useAuthUser, { getCurrentCostumer } from "../../services/userService";
import { loadProfileById } from "../../services/profileService";
import { useRouter } from "next/navigation";
import "./TopBar.css";

export default function TopBar() {
  const router = useRouter();
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const user = useAuthUser();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const profile = await loadProfileById(user.id);
      setRole(profile?.role === "user" ? "Customer" : "Admin");
      if (profile?.role === "user") {
        const customer = await getCurrentCostumer(profile);
        setName(customer?.name || "");
      } else {
        setName("Admin");
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function navigate(path: string) {
    setOpen(false);
    router.push(path);
  }

  if (name === "Admin") {
    return (
      <div className="TopBar">
        <h3>{role}</h3>
        <h1 onClick={() => router.push("/admin")}>{name}</h1>
        <div className="buttons">
          <button onClick={() => router.push("/candidates")}>
            Active candidates
          </button>
          <button onClick={() => router.push("/kanban")}>Active jobs</button>
          <div className="dropdown" ref={dropdownRef}>
            <button onClick={() => setOpen(!open)}>Create new ▼</button>
            {open && (
              <div className="dropdownMenu">
                <button onClick={() => navigate("/admin/admin-create-user")}>
                  User
                </button>
                <button onClick={() => navigate("/admin/admin-create-job")}>
                  Job
                </button>
                <button
                  onClick={() => navigate("/admin/admin-create-candidate")}
                >
                  Candidate
                </button>
              </div>
            )}
          </div>
          <button onClick={() => router.push("/")}>Sign out</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="TopBar">
        <h3>{role}</h3>
        <h1 onClick={() => router.push("/user")}>{name}</h1>
        <div className="buttons">
          <button onClick={() => router.push("/candidates")}>
            Active candidates
          </button>
          <button onClick={() => router.push("/kanban")}>Active jobs</button>
          <div className="dropdown" ref={dropdownRef}>
            <button onClick={() => setOpen(!open)}>Create new ▼</button>
            {open && (
              <div className="dropdownMenu">
                <button onClick={() => navigate("/user/user-create-candidate")}>
                  Candidate
                </button>
                <button onClick={() => navigate("/user/user-create-job")}>
                  Job
                </button>
              </div>
            )}
          </div>
          <button onClick={() => router.push("/")}>Sign out</button>
        </div>
      </div>
    );
  }
}
