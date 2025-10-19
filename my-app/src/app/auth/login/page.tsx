"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: any) => {
    e.preventDefault();
    const storedUsers = localStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const validUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (validUser) {
      alert("Login successful!");
      router.push("/dashboard"); // You can add this route later
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="form-container">
      <h2>Login to LMS</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account?{" "}
        <span className="link" onClick={() => router.push("/register")}>
          Register here
        </span>
      </p>
    </div>
  );
}
