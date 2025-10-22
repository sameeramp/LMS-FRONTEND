import Link from "next/link";
import "../app/globals.css";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const user = localStorage.getItem("user") || "";
    const token = user ? JSON.parse(user).userDetails?.token : null;
    setToken(token);
  }, [])
  return (
    <nav className="navbar">
      {token ? <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
        <Link href="/dashboard">  <h2>LMS App</h2></Link>
        <Link href="/profile">Profile</Link>
      </div> : <div>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
      </div>}
    </nav>
  );
}
