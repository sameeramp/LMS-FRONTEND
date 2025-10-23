import Link from "next/link";
import "../app/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("user") || "";
    const token = user ? JSON.parse(user).userDetails?.token : null;
    setToken(token);
  }, [])

  const logout = () => {
    localStorage.removeItem("user");
    setToken(null);
    router.push("/auth/login");
  }
  return (
    <nav className="navbar">
      {token ? <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
        <Link href="/dashboard">  <h2>LMS App</h2></Link>
        <Link href="/profile">Profile</Link>
        <a onClick={logout} >Logout</a>
      </div> : <div>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
      </div>}
    </nav>
  );
}
