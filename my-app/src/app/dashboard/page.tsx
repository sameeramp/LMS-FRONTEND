"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import "../../app/globals.css";
import { FiArrowUpRight } from "react-icons/fi";

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState<any>({});
  const router = useRouter();
  useEffect(() => {
    const username = localStorage.getItem("user") || "";
    const userDetails = user ? JSON.parse(username).userDetails : ""
    setUser(userDetails);
    const token = user ? JSON.parse(username).userDetails?.token : null;
    if (!token) {
      console.error("No token found, redirecting to login.");
      router.push('/auth/login');
    }
    if (userDetails) {
      //           axios
      // .get(`${process.env.NEXT_PUBLIC_API}/user/${userDetails?.id}/stats`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // })
      // .then((response) => {
      //   const stats =  response?.data?.stats;        
      //   if(stats.length>0) setData(stats);
      // })
      // .catch((error) => {
      //   console.error("Error fetching dashboard stats:", error);
      // });
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
    }
  }, []);

  console.log(data, 'data');

  const handleChange = (courseId: string) => {
    router.push(`/dashboard/${courseId}`);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-grid">
        <h1>Hi {user?.username}</h1>
        {data ? (
          data?.map((course: any) => (
            <div key={course._id} className="dashboard-card">
              <button onClick={() => {
                handleChange(course?._id);
              }}>
                Show The Progress
                <FiArrowUpRight
                  size={20}
                />
              </button>
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
}