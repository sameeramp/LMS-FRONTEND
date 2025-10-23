"use client";

import Navbar from "@/components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "../../../../app/globals.css";
import { FiArrowUpRight } from "react-icons/fi";
import { convertTime } from "@/utils/convertTimeFn";


export default function ViewLesson() {
    const [data, setData] = useState<any>(null);
    const [similarData, setSimilarData] = useState<any[]>([]);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    const { courseId, lessonId } = useParams();
    if (!courseId) {
        console.warn(" Waiting for ID to be available...");
        return;
    }
    useEffect(() => {
        try{   
        const username = localStorage.getItem("user") || "";
        const userDetails = username ? JSON.parse(username).userDetails : null;
        setUserId(userDetails?.id || null);
        const token = userDetails?.token || null;
        if (!token) {
            console.error("No token found, redirecting to login.");
            router.push('/auth/login');
        }
        setToken(token);
        axios.post(
            `${process.env.NEXT_PUBLIC_API}/user/get-stats-by-lesson`,
            {
                id: userDetails?.id,
                courseId,
                lessonId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((response) => {
                const progresses = response?.data?.userLesson?.progress;
                if (progresses.length > 0) {
                    const isCompleted = progresses.find((item: any) => (item.lesson === lessonId && item.completed));
                    setIsCompleted(isCompleted || false);
                }
            })
            .catch((error) => {
                console.error("Error fetching dashboard stats:", error);
            });
        axios
            .get(`${process.env.NEXT_PUBLIC_API}/course/${courseId}/similar`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setSimilarData(response?.data?.similarCourse);
            })
            .catch((error) => {
                console.error("Error fetching dashboard stats:", error);
            });
        axios
            .get(`${process.env.NEXT_PUBLIC_API}/lesson/get-one?id=${lessonId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setData(response?.data);
            })
            .catch((error) => {
                console.error("Error fetching dashboard stats:", error);
            });
        }catch(e){
        console.error("Error parsing user:", e);
        }

    }, [lessonId]);

    const handleComplete = async (courseId: any, lessonId: any) => {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/user/lessons/${userId}/complete`,
            {
                course: courseId,
                lesson: lessonId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            alert("Lesson marked as completed!");
            setIsCompleted(true);
        } else {
            alert("Failed to mark lesson as completed. Please try again.");
        }
    }
    return (
        <>
            <Navbar />

            <h1 style={{margin:"auto", padding:"5px"}}>  Lessons Details</h1>
            {isCompleted ? <p style={{color:"green", marginLeft:"10px"}}>You Successfully Completed this Course</p> : <button style={{ background: "green"}} onClick={() => {
                handleComplete(courseId, lessonId);
            }}>Mark as complete</button>}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", margin: "10px"}}>
                <div style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", width: "70%", padding: "10px", borderRadius: "5px", }}

                >
                    {data ? (

                        <div
                            key={data._id}

                        >

                            <h2>{data?.lesson}</h2>
                            <p>{convertTime(data?.createdAt) }</p>
                            <p>
                                {data?.content}
                            </p>



                        </div>

                    ) : (
                        <p>loading.....</p>
                    )}
                </div>

                <div style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
                    <h1>Similar Courses</h1>

                    <div >
                        {similarData && similarData.length > 0 ? (
                            similarData.map((item: string, index: number) => {
                                const course = JSON.parse(item);
                                return (
                                    <div key={course._id} className="dashboard-card">
                                       
                                        <h3>{course.course}</h3>
                                        <p>{new Date(course.createdAt).toLocaleDateString()}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No Data</p>
                        )}

                    </div>

                </div>
            </div>
        </>
    );
}