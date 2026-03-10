import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

export default function useAuthUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return user;
}

export async function getCurrentProfile(user: any) {
  if (!user) {
    console.warn("No user logged in");
    return null;
  }
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, customer_id")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function getCurrentCostumer(profile: any) {
  const { data: costumer, error: profileError } = await supabase
    .from("customers")
    .select("id, name")
    .eq("id", profile.customer_id)
    .single();

  return costumer;
}

export async function logIn(
  email: string,
  password: string,
  setErrorMsg: (message: string) => void,
) {
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

  return user;
}
