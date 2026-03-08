import { supabase } from "../../lib/supabase";

export async function loadCustomers() {
  const { data } = await supabase.from("customers").select("*");
  console.log("Customers from DB:", data);
  return data || [];
}

export async function insertCustomer(customer: { name: string }) {
  const { data, error } = await supabase
    .from("customers")
    .insert(customer)
    .select();

  if (error) {
    console.error("Error saving costumer:", error);
    throw error;
  }

  return data;
}
export async function updateCustomer(customer: { id: string; name?: string }) {
  const { id, ...updates } = customer;

  await supabase.from("customers").update(updates).eq("id", id);
}
