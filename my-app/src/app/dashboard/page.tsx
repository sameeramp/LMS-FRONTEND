"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import "../../app/globals.css";

export default function DashboardPage() {
    const [data, setData] = useState([]);
    const router = useRouter();
    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = user ? JSON.parse(user).userDetails?.token : null;
        if (!token) {
            console.error("No token found, redirecting to login.");
        }
        axios
            .get(`${process.env.NEXT_PUBLIC_API}/course/get-all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setData(response?.data?.course);
            })
            .catch((error) => {
                console.error("Error fetching dashboard stats:", error);
            });
    }, []);

    const handleChange = (_id: string) => {
        router.push(`/dashboard/${_id}`);
    }

    return (
        <>
            <Navbar />
            <div
                style={{
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "82px",

                    padding: "20px",
                    justifyContent: "space-between"

                }}

                className="dashboard-grid">

                {data ? (
                    data?.map((course: any) => (
                        <div key={course._id} className="dashboard-card"

                            onClick={() => handleChange(course?._id)}


                            style={{
                                border: "1px solid #ccc", borderRadius: "8px", padding: "16px",
                                backgroundColor: "#f9f9f9",
                                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
                            }}

                        >
                            <h3>{course?.course}</h3>
                            <p>{course?.createdAt}</p>

                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    );

};