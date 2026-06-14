"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SITE_NAME,
  SITE_TAGLINE,
  CONTACT,
  SOCIAL_LINKS,
  FOOTER_TEXT,
} from "@/config/siteConfig";
import api from "@/lib/api";

export default function SiteFooter() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  return (
    <footer className="bg-dark-custom text-light pt-5">
      <div className="container">
        <div className="row gy-4 pb-4">
          <div className="col-lg-4 col-md-6">
            <Link href="/" className="d-flex align-items-center gap-2 fs-4 fw-bold text-white font-heading mb-3">
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-custom text-white"
                style={{ width: 36, height: 36, fontSize: "1rem" }}
              >
                V
              </span>
              {SITE_NAME}
            </Link>
            <p className="text-secondary small mb-3">{SITE_TAGLINE}</p>
            <p className="text-secondary small">
              Vidyaan is an online learning platform helping students and
              professionals build in-demand skills through expert-led
              courses, hands-on projects, and mentorship.
            </p>
            <div className="d-flex gap-2 mt-3">
              {[
                { icon: "bi-facebook", href: SOCIAL_LINKS.facebook },
                { icon: "bi-instagram", href: SOCIAL_LINKS.instagram },
                { icon: "bi-linkedin", href: SOCIAL_LINKS.linkedin },
                { icon: "bi-youtube", href: SOCIAL_LINKS.youtube },
              ].map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-25 text-white"
                  style={{ width: 36, height: 36 }}
                >
                  <i className={`bi ${s.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link href="/about" className="text-secondary">About Us</Link></li>
              <li><Link href="/courses" className="text-secondary">Courses</Link></li>
              <li><Link href="/teachers" className="text-secondary">Teachers</Link></li>
              <li><Link href="/contact" className="text-secondary">Contact</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3">Categories</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/courses?category=${cat.slug}`} className="text-secondary">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3">Contact Us</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small">
              <li className="d-flex gap-2">
                <i className="bi bi-geo-alt-fill mt-1"></i>
                <span>{CONTACT.address}</span>
              </li>
              <li className="d-flex gap-2">
                <i className="bi bi-telephone-fill"></i>
                <span>{CONTACT.phone}</span>
              </li>
              <li className="d-flex gap-2">
                <i className="bi bi-envelope-fill"></i>
                <span>{CONTACT.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-top border-secondary border-opacity-25 py-3 text-center text-secondary small">
          {FOOTER_TEXT}
        </div>
      </div>
    </footer>
  );
}
