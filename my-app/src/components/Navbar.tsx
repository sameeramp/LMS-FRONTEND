import Link from "next/link";
import "../app/globals.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>LMS App</h2>
      <div>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
      </div>
    </nav>
  );
}
