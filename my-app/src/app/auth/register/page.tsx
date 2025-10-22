"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).userDetails?.token : null;
    if (token) {
      console.error("Token is found, redirecting to Dashboard.");
      router.push('/dashboard');
    }
  }, [router]);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/auth/register`, {
        username,
        email,
        password,
      })
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data));
        router.push("/dashboard");
      }
    } catch (error) {
      alert("Internal Server Error!");
    }
    router.push("/dashboard");
  };

  return (
    <div className="form-container">
      <h2>Register for LMS</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account?{" "}
        <span className="link" onClick={() => router.push("/auth/login")}>
          Login here
        </span>
      </p>
    </div>
  );
}
