"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import "../../app/globals.css";
import { FiArrowUpRight } from "react-icons/fi";
import { convertTime } from "@/utils/convertTimeFn";

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

  const handleChange = (courseId: string) => {
    router.push(`/dashboard/${courseId}`);
  };

  return (
    <>
      <Navbar />
      <h1 className="username-heading" >Hi {user?.username}</h1>


      <div className="dashboard-grid">


        {data ? (
          data?.map((course: any) => (
            <div key={course._id} className="dashboard-card">
              <button className="view-button" 
               onClick={() => {
                handleChange(course?._id);
              }}>
                View The Progress
                <FiArrowUpRight
                  size={20}
                 
                />
              </button>
              <h3> Course Name: {course?.course}</h3>
              <p> Joined Date: {convertTime(course?.createdAt) }</p>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}