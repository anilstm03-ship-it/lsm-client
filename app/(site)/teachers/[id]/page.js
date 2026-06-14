"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Spin } from "antd";
import CourseCard from "@/components/site/CourseCard";
import api from "@/lib/api";

const PLACEHOLDER = "https://placehold.co/300x300/2563eb/ffffff?text=Vidyaan";

export default function TeacherDetailsPage() {
  const params = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/teachers/${params.id}`)
      .then((res) => setTeacher(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (notFound || !teacher) {
    return (
      <div className="container py-5 text-center">
        <h2 className="font-heading mb-2">Teacher Not Found</h2>
        <p className="text-muted mb-4">The teacher profile you&apos;re looking for doesn&apos;t exist or is no longer available.</p>
        <Link href="/teachers" className="btn btn-primary rounded-pill px-4">Browse Teachers</Link>
      </div>
    );
  }

  const social = teacher.social_links || {};
  const teacherCourses = teacher.courses || [];

  return (
    <>
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-auto">
              <img
                src={teacher.photo || PLACEHOLDER}
                alt={teacher.name}
                className="rounded-circle border border-4 border-white"
                width={120}
                height={120}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="col">
              <h1 className="font-heading mb-1">{teacher.name}</h1>
              {teacher.designation && <p className="text-white-50 mb-2">{teacher.designation}</p>}
              <div className="d-flex gap-3">
                {social.linkedin && (
                  <a href={social.linkedin} className="btn btn-sm btn-outline-light rounded-circle">
                    <i className="bi bi-linkedin"></i>
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} className="btn btn-sm btn-outline-light rounded-circle">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                )}
                {social.website && (
                  <a href={social.website} className="btn btn-sm btn-outline-light rounded-circle">
                    <i className="bi bi-globe"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card card-custom border-0 p-4">
                <h6 className="font-heading mb-3">About</h6>
                <p className="text-muted small">{teacher.bio || "No bio added yet."}</p>
                <hr />
                <ul className="list-unstyled d-flex flex-column gap-2 text-muted small mb-0">
                  {teacher.specialization && (
                    <li><i className="bi bi-mortarboard text-primary-custom me-2"></i>{teacher.specialization}</li>
                  )}
                  {teacher.experience_years != null && (
                    <li><i className="bi bi-briefcase text-primary-custom me-2"></i>{teacher.experience_years}+ years experience</li>
                  )}
                  <li><i className="bi bi-journal-bookmark text-primary-custom me-2"></i>{teacherCourses.length} courses published</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-8">
              <h5 className="font-heading mb-4">Courses by {teacher.name}</h5>
              {teacherCourses.length === 0 ? (
                <p className="text-muted">No courses published yet.</p>
              ) : (
                <div className="row g-4">
                  {teacherCourses.map((course) => (
                    <div className="col-md-6" key={course.id}>
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
