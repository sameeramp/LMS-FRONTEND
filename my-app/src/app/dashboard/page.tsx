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
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/auth/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      const userDetails = parsedUser?.userDetails;
      const token = userDetails?.token;

      if (!token) {
        router.push("/auth/login");
        return;
      }

      setUser(userDetails);

      axios
        .get(`${process.env.NEXT_PUBLIC_API}/course/get-all`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setData(res?.data?.course || []))
        .catch((err) => console.error("Error fetching dashboard stats:", err));
    } catch (e) {
      console.error("Error parsing user:", e);
      router.push("/auth/login");
    }
  }, []);

  const handleChange = (courseId: string) => {
    router.push(`/dashboard/${courseId}`);
  };

  if (!user?.username) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <h1 className="username-heading">Hi {user?.username}</h1>

      <div className="dashboard-grid">
        {data?.length ? (
          data.map((course: any) => (
            <div key={course._id} className="dashboard-card">
              <button
                className="view-button"
                onClick={() => handleChange(course?._id)}
              >
                View The Progress
                <FiArrowUpRight size={20} />
              </button>
              <h3>Course Name: {course?.course}</h3>
              <p>Joined Date: {convertTime(course?.createdAt)}</p>
            </div>
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </div>
    </>
  );
}
