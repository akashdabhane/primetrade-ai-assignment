'use client';
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCheck, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { baseUrl } from "@/utils/helper";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useRouter();

    const loadData = async () => {
        try {
            const response = await axios.get(`${baseUrl}/admin/users`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`
                }
            })

            console.log(response.data.data)
            setUsers(response.data.data)
            setLoading(false)
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
                <button
                    onClick={() => navigate.push('/')}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                >
                    <FaArrowLeft /> Back
                </button>
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
                                    <th className="border border-gray-300 p-3 text-left">Id</th>
                                    <th className="border border-gray-300 p-3 text-left">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, idx) => (
                                    <tr
                                        key={u._id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => navigate.push(`/admin/users/${u._id}`)}
                                    >
                                        <td className="border border-gray-300 p-3">{idx + 1}</td>
                                        <td className="border border-gray-300 p-3">{u._id}</td>
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