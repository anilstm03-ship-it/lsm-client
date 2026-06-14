"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME } from "@/config/siteConfig";
import useAuthStore from "@/store/authStore";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/teachers", label: "Teachers" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, fetchProfile, logout } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("vidyaan_access_token")) {
      fetchProfile();
    } else {
      useAuthStore.setState({ loading: false });
    }
  }, [fetchProfile]);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-white shadow-sm sticky-top">
      <nav className="navbar navbar-expand-lg container py-3">
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2 font-heading fw-bold fs-3 text-primary-custom">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-custom text-white"
            style={{ width: 40, height: 40, fontSize: "1.1rem" }}
          >
            V
          </span>
          {SITE_NAME}
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <i className="bi bi-list fs-1"></i>
        </button>

        <div className={`navbar-collapse ${open ? "d-block" : "d-none"} d-lg-flex justify-content-lg-end`}>
          <ul className="navbar-nav mb-3 mb-lg-0 ms-lg-auto align-items-lg-center gap-lg-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li className="nav-item" key={link.href}>
                  <Link
                    href={link.href}
                    className={`nav-link fw-medium px-3 ${active ? "text-primary-custom" : "text-dark"}`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 ms-lg-3">
            {!loading && user ? (
              <>
                <span className="fw-medium text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-person-circle text-primary-custom fs-5"></i>
                  {user.name}
                </span>
                {user.role === "student" && (
                  <Link href="/dashboard" className="btn btn-outline-primary rounded-pill px-4" onClick={() => setOpen(false)}>
                    My Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link href="/admin" className="btn btn-outline-primary rounded-pill px-4" onClick={() => setOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <button className="btn btn-outline-primary rounded-pill px-4" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline-primary rounded-pill px-4" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary rounded-pill px-4" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
