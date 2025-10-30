'use client';
import { baseUrl } from "@/utils/helper";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaUser } from "react-icons/fa";


/* ---------------- UserProfilePage: show tasks for a user + approve functionality ---------------- */
export default function UserProfilePage() {
    const { _id: userId } = useParams(); // from route /admin/users/:id
    const navigate = useRouter();

    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const loadData = async () => {
        try {
            const response = await axios.get(`${baseUrl}/admin/users/${userId}/tasks`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`
                }
            })

            console.log(response.data.data)
            setTasks(response.data.data.pending)
            setUser(response.data.data.user)
            setLoadingTasks(false);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadData()
    }, []);


    return (
        <div className="w-full min-h-screen py-24 bg-gray-100">
            <div className="mx-4 md:m-auto text-black bg-white p-6 md:w-[75%] rounded-md shadow-md space-y-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate.push('/admin/users')}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <h2 className="text-2xl font-bold">User Profile</h2>
                    <div />
                </div>

                {!user ? (
                    <p className="text-center py-10 text-gray-500">User not found.</p>
                ) : (
                    <>
                        <div className="border border-gray-200 rounded-md p-4">
                            <h3 className="text-lg font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Tasks</h3>
                                <span className="text-sm text-gray-500">{tasks?.length} tasks</span>
                            </div>

                            {loadingTasks ? (
                                <p className="text-center py-6 text-gray-500">Loading tasks...</p>
                            ) : tasks?.length === 0 ? (
                                <p className="text-center py-6 text-gray-500">No tasks for this user.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                <th className="border border-gray-300 p-3">#</th>
                                                <th className="border border-gray-300 p-3 text-left">Title</th>
                                                <th className="border border-gray-300 p-3 text-left">Description</th>
                                                <th className="border border-gray-300 p-3 text-center">Status</th>
                                                <th className="border border-gray-300 p-3 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasks.map((task, idx) => (
                                                <tr key={task._id} className="hover:bg-gray-50">
                                                    <td className="border border-gray-300 p-3 text-center">{idx + 1}</td>
                                                    <td className="border border-gray-300 p-3">{task.title}</td>
                                                    <td className="border border-gray-300 p-3">{task.description}</td>
                                                    <td className="border border-gray-300 p-3 text-center">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs ${task.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                                }`}
                                                        >
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td className="border border-gray-300 p-3 text-center">
                                                        {task.status !== "approved" ? (
                                                            <button className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-black text-white text-sm">
                                                                <FaCheck /> Approve
                                                            </button>
                                                        ) : (
                                                            <span className="text-sm text-gray-500">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}