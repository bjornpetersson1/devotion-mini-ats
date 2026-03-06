// app/adminCreateCustomerProfile/page.tsx
import AdminCreateCustomer from "../components/AdminCreateCustomer";

export default function Page() {
  return <AdminCreateCustomer />;
}
// "use client";
// import { useState } from "react";

// export default function AdminCreateCustomer() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");

//   const createCustomer = async () => {
//     const res = await fetch("/api/create-customer", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email }),
//     });

//     const data = await res.json();

//     if (data.error) {
//       setMessage(`Error: ${data.error}`);
//     } else {
//       setMessage(`Customer created: ${data.profile[0].username}`);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "50px auto" }}>
//       <h1>Create Customer Profile</h1>

//       <input
//         type="text"
//         placeholder="Customer Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="border p-2 w-full mb-4"
//       />

//       <input
//         type="email"
//         placeholder="Customer Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="border p-2 w-full mb-4"
//       />

//       <button
//         onClick={createCustomer}
//         className="bg-blue-500 text-white px-4 py-2"
//       >
//         Create Customer
//       </button>

//       {message && <p style={{ marginTop: 10 }}>{message}</p>}
//     </div>
//   );
// }
// "use client";
// import { useState } from "react";
// import { supabase } from "@/lib/supabase";

// export default function AdminCreateCustomer() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   const createCustomer = async () => {
//     const { data: userData, error: userError } =
//       await supabase.auth.admin.createUser({
//         email,
//         password: "userPassword",
//         email_confirm: false,
//       });

//     if (userError) {
//       console.error("Error creating user:", userError.message);
//       return;
//     }

//     const user = userData.user;

//     const { data: profileData, error: profileError } = await supabase
//       .from("profiles")
//       .insert({
//         id: user.id,
//         email: user.email,
//         username: name,
//         role: "user",
//       });

//     if (profileError) {
//       console.error("Error creating profile:", profileError.message);
//       return;
//     }
//     console.log("Customer created:", profileData);
//   };

//   return (
//     <div>
//       <h1>Create Customer Profile</h1>
//       <input
//         type="text"
//         placeholder="Customer Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="border p-2 w-full mb-4"
//       />
//       <input
//         type="email"
//         placeholder="Customer Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="border p-2 w-full mb-4"
//       />
//       <button
//         onClick={createCustomer}
//         className="bg-blue-500 text-white px-4 py-2"
//       >
//         Create Customer Profile
//       </button>
//     </div>
//   );
// }

//     return (
//       <div>
//         <h1>Create Customer Profile</h1>
//         <input
//           type="text"
//           placeholder="Customer Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="border p-2 w-full mb-4"
//         />

//         <input
//           type="email"
//           placeholder="Customer Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border p-2 w-full mb-4"
//         />

//         <button
//           onClick={() => createProfile({ email, password: "defaultpassword" })}
//           className="bg-blue-500 text-white px-4 py-2"
//         >
//           Create Customer Profile
//         </button>
//       </div>
//     );
//   };
// }
