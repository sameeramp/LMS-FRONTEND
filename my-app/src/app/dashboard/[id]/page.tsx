"use client"

import Navbar from "@/components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


export default function ViewDashbord() {
const [data, setData] = useState([]);


  const { id } = useParams();

    if (!id) {
      console.warn(" Waiting for ID to be available...");
      return;
    }
    console.log(id,"id")

      useEffect(() => {
        const user = localStorage.getItem("user");
        const token = user ? JSON.parse(user).userDetails?.token : null;
        console.log(token,"token")
        if (!token) {
            console.error("No token found, redirecting to login.");
        }
        axios
            .get(`${process.env.NEXT_PUBLIC_API}/course/get-one`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { id },
            })
            .then((response) => {
                setData(response?.data?.course);
            })
            .catch((error) => {
                console.error("Error fetching dashboard stats:", error);
            });
    }, [id]);
console.log(data,"data")
    
  return (
    <>
    <Navbar/>
{data.map
        ((course: any) => (
            <div key={course._id} className="dashboard-card">{course?.lesson}</div>      
        ))}                                                

    </>
  );
}
