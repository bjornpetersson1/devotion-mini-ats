import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";

export default function useAuthUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Hämta initialt
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Lyssna på förändringar
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
    return null; // returnera null om ingen inloggad
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
