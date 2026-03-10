import { supabase } from "../../lib/supabase";

export async function getAllCustomers() {
  const { data, error } = await supabase.from("customers").select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function getCustomersByIds(customerIds: string[]) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .in("id", customerIds);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
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
// export async function updateCustomer(customer: { id: string; name?: string }) {
//   const { id, ...updates } = customer;

//   await supabase.from("customers").update(updates).eq("id", id);
// }
