'use client';
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

/**
 * NOTE:
 * - Replace the mock fetch functions with real API calls (axios/fetch) as needed.
 * - Add authentication / admin-guard around routes in your app.
 */

/* ---------------------- Mock API (replace with real API calls) ---------------------- */
const mockUsers = [
    { id: "u1", name: "Akash Dabhane", email: "akash@example.com" },
    { id: "u2", name: "Priya Sharma", email: "priya@example.com" },
    { id: "u3", name: "Ravi Kumar", email: "ravi@example.com" },
];

const mockTasksByUser = {
    u1: [
        { id: "t1", title: "Write docs", description: "Write README", status: "pending" },
        { id: "t2", title: "Fix bug #12", description: "Null pointer", status: "approved" },
    ],
    u2: [
        { id: "t3", title: "Design hero", description: "Create hero section", status: "pending" },
    ],
    u3: [],
};

const api = {
    fetchUsers: async () => {
        // simulate network latency
        await new Promise((r) => setTimeout(r, 200));
        return mockUsers;
    },
    fetchUserTasks: async (userId) => {
        await new Promise((r) => setTimeout(r, 200));
        return mockTasksByUser[userId] ?? [];
    },
    approveTask: async (userId, taskId) => {
        // simulate backend update
        await new Promise((r) => setTimeout(r, 200));
        const tasks = mockTasksByUser[userId];
        const idx = tasks.findIndex((t) => t.id === taskId);
        if (idx >= 0) tasks[idx].status = "approved";
        return tasks[idx];
    },
};

/* ------------------------------------------------------------------------------------ */

/* ---------------------- AdminUsersPage: list of users in a table --------------------- */
export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useRouter();

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await api.fetchUsers(); // replace with axios.get('/api/admin/users')
                if (mounted) setUsers(data);
            } catch (err) {
                console.error("Failed to load users", err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => (mounted = false);
    }, []);

    return (
        <div className="w-full min-h-screen py-24 bg-gray-100">
            <div className="mx-4 md:m-auto text-black bg-white p-6 md:w-[75%] rounded-md shadow-md space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FaUser /> Users
                    </h2>
                    <span className="text-sm text-gray-500">Admin Panel</span>
                </div>

                {loading ? (
                    <p className="text-center py-10 text-gray-500">Loading users...</p>
                ) : users.length === 0 ? (
                    <p className="text-center py-10 text-gray-500">No users found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 p-3 text-left">#</th>
                                    <th className="border border-gray-300 p-3 text-left">Name</th>
                                    <th className="border border-gray-300 p-3 text-left">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, idx) => (
                                    <tr
                                        key={u.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => navigate(`/login`)}
                                    >
                                        <td className="border border-gray-300 p-3">{idx + 1}</td>
                                        <td className="border border-gray-300 p-3">{u.name}</td>
                                        <td className="border border-gray-300 p-3">{u.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}



/* -------------------- Example routes wrapper (for quick integration) -------------------- */
// export default function AdminPagesRouterExample() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/admin/users" element={<AdminUsersPage />} />
//         <Route path="/admin/users/:id" element={<UserProfilePage />} />
//         <Route
//           path="*"
//           element={
//             <div className="w-full min-h-screen flex items-center justify-center">
//               <div className="bg-white p-6 rounded-md shadow-md">
//                 <h3 className="font-semibold mb-4">Admin Panel Example</h3>
//                 <Link to="/admin/users" className="text-blue-600">
//                   Go to Users
//                 </Link>
//               </div>
//             </div>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }
