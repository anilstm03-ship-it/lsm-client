"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Spin } from "antd";
import useAuthStore from "@/store/authStore";

const navItems = [
  { href: "/dashboard", label: "My Courses", icon: "bi-journal-bookmark" },
  { href: "/dashboard/profile", label: "Profile", icon: "bi-person" },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("vidyaan_access_token")) {
      if (!user) fetchProfile();
    } else {
      useAuthStore.setState({ loading: false });
    }
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== "student")) {
      router.push("/login?redirect=/dashboard");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "student") {
    return (
      <div className="container py-5 text-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-3">
          <div className="card card-custom border-0 p-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-person-circle fs-3 text-primary-custom"></i>
              <div>
                <div className="fw-medium">{user.name}</div>
                <div className="text-muted small">{user.email}</div>
              </div>
            </div>
            <ul className="nav nav-pills flex-column gap-1">
              {navItems.map((item) => (
                <li className="nav-item" key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-link d-flex align-items-center gap-2 ${pathname === item.href ? "active" : "text-dark"}`}
                  >
                    <i className={`bi ${item.icon}`}></i>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-lg-9">{children}</div>
      </div>
    </div>
  );
}
