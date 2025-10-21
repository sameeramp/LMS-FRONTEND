"use client"

import Navbar from "@/components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


export default function ViewDashbord() {
    const [data, setData] = useState([]);
    const router = useRouter();


    const { id } = useParams();

    if (!id) {
        console.warn(" Waiting for ID to be available...");
        return;
    }



    const handleView = (_id:any) => {
        router.push(`/ViewDashbord/${id}/${_id}`);
    }


    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = user ? JSON.parse(user).userDetails?.token : null;
        console.log(token, "token")
        if (!token) {
            console.error("No token found, redirecting to login.");
        }
        axios
            .get(`${process.env.NEXT_PUBLIC_API}/lesson/get-by-course?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log(response, "response")
                setData(response?.data?.courseData);
            })
            .catch((error) => {
                console.error("Error fetching dashboard stats:", error);
            });
    }, [id]);

    return (
        <>
            <Navbar />
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "82px",

                padding: "20px",
                justifyContent: "space-between"

            }}>


                {data.length > 0 ? (data.map
                    ((course: any) => (
                        <div onClick={()=>handleView(course?._id)} key={course._id}
                            style={{
                                border: "1px solid #ccc", borderRadius: "8px", padding: "16px",
                                backgroundColor: "#f9f9f9",
                                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
                            }}
                            className="dashboard-card">

                            <h2>
                                {course?.lesson}
                            </h2>
                            <p>
                                {course?.content
                                    ?.replace(/\n/g, " ")
                                    ?.slice(0, 150)}...
                            </p> 
                            <p>Status: Completed</p>
                            
                                               </div>

                    ))) : (<p>No lessons available for this course.</p>)
                   
                }
            </div>

        </>
    );
}
