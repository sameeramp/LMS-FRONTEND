

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import "../../app/globals.css";
import { FiArrowUpRight } from "react-icons/fi";

export default function Viwprofile() {
    const [user, setUser] = useState<any>({});
    const [analytics, setAnalytics] = useState<any>(null);
    const router = useRouter();
    useEffect(() => {
        const user = localStorage.getItem("user");
        const userDetails = user ? JSON.parse(user).userDetails : "";
        setUser(userDetails);
        const token = user ? JSON.parse(user).userDetails?.token : null;
        if (!token) {
            console.error("No token found, redirecting to login.");
            router.push('/auth/login');
        }
        axios
            .get(`${process.env.NEXT_PUBLIC_API}/user/68f32c49b75ce450346fdd75/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const statsArray = response?.data?.stats || [];
                if (statsArray.length > 0) {
                    const courseName = Object.keys(statsArray[0])[0];
                    const courseStats = Object.assign({}, ...statsArray[0][courseName]);
                    setAnalytics({ courseName, stats: courseStats });
                }
            })
            .catch((error) => {
                console.error("Error fetching dashboard stats:", error);
            });
    }, []); 
    return (
        <>
            <Navbar />

            <h1>Profile </h1>
            <div >
                {user ? (
                    <div className="user-card" style={{
                        border: "2px solid black", padding: "10px", borderRadius: "5px", width: "50%", margin: "auto",
                    }}
                        key={user.userId} >
                        <h3>createdAt: {user?.createdAt}</h3>
                        <p>email:{user?.email}</p>
                        <p>isAdmin :{user?.isAdmin ? "Admin" : "User"}</p>
                        <p>username: {user?.username}</p>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <div style={{
                border: "2px solid black", padding: "10px", borderRadius: "5px", width: "50%", margin: "auto",
            }} >
                <h2>Analytics</h2>
                {analytics ? (
                    <>
                        <h3>{analytics.courseName}</h3>
                        <ul>
                            <li>Total Lessons: {analytics.stats.totalLessons}</li>
                            <li>Attended Lessons: {analytics.stats.attendedLessons}</li>
                            <li>Completed Lessons: {analytics.stats.completedLessons}</li>
                            <li>Attended %: {analytics.stats.attendedPercentage}%</li>
                            <li>Completed %: {analytics.stats.completedPercentage}%</li>
                        </ul>
                    </>
                ) : (
                    <p>Loading analytics...</p>
                )}
            </div>

        </>
    );
}