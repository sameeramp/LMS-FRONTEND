"use client";

import Navbar from "@/components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "../../../app/globals.css";
import { FiArrowUpRight } from "react-icons/fi";


export default function ViewDashbord() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState<any>({});

  const router = useRouter();

  const { courseId } = useParams();
  if (!courseId) {
    console.warn(" Waiting for ID to be available...");
    return;
  }

  const handleView = (lessonId: string) => {
    router.push(`/dashboard/${courseId}/${lessonId}`);
  };

  useEffect(() => {
    const username = localStorage.getItem("user") || "";
    const userDetails = user ? JSON.parse(username).userDetails : ""
    setUser(userDetails);
    const token = username ? JSON.parse(username).userDetails?.token : null;
    if (!token) {
      console.error("No token found, redirecting to login.");
      router.push('/auth/login');
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_API}/lesson/get-by-course?id=${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response?.data?.courseData);
      })
      .catch((error) => {
        console.error("Error fetching dashboard stats:", error);
      });
  }, [courseId]);

  return (
    <>
      <Navbar />
      <h1 className="username-heading" >Hi {user?.username}</h1>

      <div className="dashboard-grid">
        {data.length > 0 ? (
          data.map((course: any) => (
            <div
              key={course._id}
              className="dashboard-card"
            >
              <button className="view-button" onClick={() => {
                handleView(course._id);
              }}>
                Read Lesson
                <FiArrowUpRight
                  size={20}
                />
              </button>
              <h2>{course?.lesson}</h2>
              <p>{course?.content?.replace(/\n/g, " ")?.slice(0, 150)}...</p>

            </div>
          ))
        ) : (
          <p>loading.....</p>
        )}
      </div>
    </>
  );
}