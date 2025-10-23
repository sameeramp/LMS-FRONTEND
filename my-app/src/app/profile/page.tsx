

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import "../../app/globals.css";
import { FiArrowUpRight } from "react-icons/fi";

export default function Viwprofile() {
    const [user, setUser] = useState<any>({});
    const [analytics, setAnalytics] = useState<any>([]);
    const router = useRouter();
    useEffect(() => {
        try{
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
                    setAnalytics(statsArray);
                }
            })
            .catch((error) => {
                console.error("Error fetching dashboard stats:", error);
            });
            }
        catch(e){
        console.error("Error parsing user:", e);
        }
    }, []);

    return (
        <>
            <Navbar />
            <div style={{display:"flex", flexDirection:"column", gap:"20px", marginTop:"20px", width: "100%", alignItems: "center"}}>
                <h1 style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", background: "yellow"}}>PROFILE </h1>
                <div style={{width: "100%"}} >
                    {user ? (
                        <div className="user-card" style={{
                            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", textAlign: "center",
                            border: "2px solid black", padding: "10px", borderRadius: "5px", width: "50%", margin: "auto",
                        }}
                            key={user.userId} >
                            <p>USERNAME: <span style={{fontStyle: "italic", fontSize: "20px", fontWeight: "bolder"}}>{user?.username}</span></p>
                            <p>EMAIL: <span style={{fontStyle: "italic", fontSize: "20px", fontWeight: "bolder"}}>{user?.email}</span></p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div>
                    <h2 style={{textAlign: "center", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", background: "yellow"}}>Analytics</h2>
                    {analytics.length > 0 ? analytics.map((elem: any, idx: number) => {
                        return ((
                            <div style={{
                                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    padding: "10px", borderRadius: "5px", width: "100%", margin: "auto",
                }} key={idx} >
                                <h3 style={{marginTop: "5px", textAlign: "center", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", background: "yellow"}}>{elem.courseName}</h3>
                                <ul>
                                    <li>Total Lessons: <span style={{fontWeight: "bolder", background: "#969d5c"}}>{elem.totalLessons}</span></li>
                                    <li>Attended Lessons: <span style={{fontWeight: "bolder", background: "#969d5c"}}>{elem.attendedLessons}</span></li>
                                    <li>Completed Lessons: <span style={{fontWeight: "bolder", background: "#969d5c"}}>{elem.completedLessons}</span></li>
                                    <li>Attended Percentage: <span style={{fontWeight: "bolder", background: "#969d5c"}}>{elem.attendedPercentage}%</span></li>
                                    <li>Completed Percentage: <span style={{fontWeight: "bolder", background: "#969d5c"}}>{elem.completedPercentage}%</span></li>
                                </ul>
                            </div>
                        ))
                    }) : (
                        <p>Loading analytics...</p>
                    )}
                </div>
            </div>
        </>
    );
}