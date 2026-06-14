"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroBanner from "@/components/site/HeroBanner";
import StatsStrip from "@/components/site/StatsStrip";
import CategoryCard from "@/components/site/CategoryCard";
import CourseCard from "@/components/site/CourseCard";
import TeacherCard from "@/components/site/TeacherCard";
import { testimonials } from "@/lib/mockData";
import api from "@/lib/api";

const features = [
  {
    icon: "bi-laptop",
    title: "Learn Anywhere",
    desc: "Access your courses anytime on any device with lifetime access to course materials.",
  },
  {
    icon: "bi-patch-check-fill",
    title: "Expert Instructors",
    desc: "Learn from industry professionals with years of real-world experience.",
  },
  {
    icon: "bi-mortarboard-fill",
    title: "Certification",
    desc: "Earn certificates on course completion to showcase your new skills.",
  },
  {
    icon: "bi-headset",
    title: "Dedicated Support",
    desc: "Get help from mentors and our support team whenever you need it.",
  },
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [featuredTeachers, setFeaturedTeachers] = useState([]);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.data || [])).catch(() => {});
    api.get("/courses", { params: { limit: 6 } }).then((res) => setPopularCourses(res.data.data || [])).catch(() => {});
    api.get("/teachers").then((res) => setFeaturedTeachers((res.data.data || []).slice(0, 4))).catch(() => {});
  }, []);

  return (
    <>
      <HeroBanner />

      {/* Featured Categories */}
      {categories.length > 0 && (
        <section className="section-padding">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-title-sm">Browse by Category</span>
              <h2 className="font-heading mt-2">Top Categories to Explore</h2>
            </div>
            <div className="row g-4">
              {categories.map((cat) => (
                <div className="col-md-4" key={cat.id}>
                  <CategoryCard category={cat} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Courses */}
      {popularCourses.length > 0 && (
        <section className="section-padding bg-light-custom">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
              <div>
                <span className="section-title-sm">Our Courses</span>
                <h2 className="font-heading mt-2 mb-0">Most Popular Courses</h2>
              </div>
              <Link href="/courses" className="btn btn-outline-primary rounded-pill px-4 mt-3 mt-md-0">
                View All Courses
              </Link>
            </div>
            <div className="row g-4">
              {popularCourses.map((course) => (
                <div className="col-md-6 col-lg-4" key={course.id}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Vidyaan */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-title-sm">Why Choose Us</span>
            <h2 className="font-heading mt-2">Why Learn with Vidyaan</h2>
          </div>
          <div className="row g-4">
            {features.map((f) => (
              <div className="col-md-6 col-lg-3 text-center" key={f.title}>
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-custom bg-opacity-10 mb-3"
                  style={{ width: 64, height: 64 }}
                >
                  <i className={`bi ${f.icon} fs-3 text-primary-custom`}></i>
                </div>
                <h6 className="font-heading">{f.title}</h6>
                <p className="text-muted small">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-dark-custom">
        <div className="container">
          <StatsStrip variant="dark" />
        </div>
      </section>

      {/* Featured Teachers */}
      {featuredTeachers.length > 0 && (
        <section className="section-padding">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-title-sm">Meet Our Mentors</span>
              <h2 className="font-heading mt-2">Learn From The Best</h2>
            </div>
            <div className="row g-4">
              {featuredTeachers.map((teacher) => (
                <div className="col-md-6 col-lg-3" key={teacher.id}>
                  <TeacherCard teacher={teacher} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="section-padding bg-light-custom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-title-sm">Testimonials</span>
            <h2 className="font-heading mt-2">What Our Students Say</h2>
          </div>
          <div className="row g-4">
            {testimonials.map((t) => (
              <div className="col-md-4" key={t.id}>
                <div className="card card-custom border-0 h-100 p-4">
                  <div className="d-flex mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i
                        key={i}
                        className={`bi ${i < t.rating ? "bi-star-fill text-warning" : "bi-star text-warning"} me-1`}
                      ></i>
                    ))}
                  </div>
                  <p className="text-muted small flex-grow-1">&ldquo;{t.feedback}&rdquo;</p>
                  <div className="d-flex align-items-center gap-3 mt-3">
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="rounded-circle"
                      width={48}
                      height={48}
                    />
                    <div>
                      <h6 className="mb-0">{t.name}</h6>
                      <p className="text-muted small mb-0">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding hero-section">
        <div className="container text-center">
          <h2 className="font-heading mb-3">Ready to Start Learning?</h2>
          <p className="text-white-50 mb-4">
            Join Vidyaan today and get access to expert-led courses designed
            to help you achieve your career goals.
          </p>
          <Link href="/register" className="btn btn-accent btn-lg rounded-pill px-5">
            Get Started Now
          </Link>
        </div>
      </section>
    </>
  );
}
