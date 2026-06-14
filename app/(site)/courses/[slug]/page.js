"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Tabs, Rate, Spin, message } from "antd";
import { testimonials } from "@/lib/mockData";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";

const levelColors = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

const PLACEHOLDER = "https://placehold.co/900x500/2563eb/ffffff?text=Vidyaan";

export default function CourseDetailsPage() {
  const params = useParams();
  const user = useAuthStore((s) => s.user);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    api.get(`/courses/${params.slug}`)
      .then((res) => setCourse(res.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  useEffect(() => {
    if (!course || user?.role !== "student") return;
    api.get(`/enrollments/check/${course.id}`)
      .then((res) => setEnrollment(res.data.data.enrollment))
      .catch(() => {});
  }, [course, user]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const res = await api.post("/enrollments", { course_id: course.id });
      setEnrollment(res.data.data);
      message.success("Enrolled successfully!");
    } catch (err) {
      message.error(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className="container py-5 text-center">
        <h2 className="font-heading mb-2">Course Not Found</h2>
        <p className="text-muted mb-4">The course you&apos;re looking for doesn&apos;t exist or is no longer available.</p>
        <Link href="/courses" className="btn btn-primary rounded-pill px-4">Browse Courses</Link>
      </div>
    );
  }

  const hasDiscount = course.discount_price && Number(course.discount_price) < Number(course.price);
  const hasTeacher = !!course.teacher_name;

  const tabItems = [
    {
      key: "overview",
      label: "Overview",
      children: (
        <div>
          <h5 className="font-heading mb-3">Course Overview</h5>
          <p className="text-muted">
            {course.description || course.short_description}
          </p>
          {Array.isArray(course.learning_points) && course.learning_points.length > 0 && (
            <>
              <h6 className="font-heading mt-4 mb-2">What you&apos;ll learn</h6>
              <div className="row">
                {course.learning_points.map((item) => (
                  <div className="col-md-6 mb-2" key={item}>
                    <i className="bi bi-check-circle-fill text-primary-custom me-2"></i>
                    {item}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      key: "curriculum",
      label: "Curriculum",
      children: Array.isArray(course.modules) && course.modules.length > 0 ? (
        <div className="accordion" id="curriculumAccordion">
          {course.modules.map((module, idx) => (
            <div className="accordion-item" key={module.id}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${idx !== 0 ? "collapsed" : ""}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#module-${module.id}`}
                >
                  {module.title}
                </button>
              </h2>
              <div
                id={`module-${module.id}`}
                className={`accordion-collapse collapse ${idx === 0 ? "show" : ""}`}
              >
                <div className="accordion-body">
                  {module.lessons.length === 0 ? (
                    <p className="text-muted mb-0">No lessons added yet.</p>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {module.lessons.map((lesson) => (
                        <li key={lesson.id} className="d-flex align-items-center justify-content-between gap-2 py-1">
                          <span>
                            <i className="bi bi-play-circle text-primary-custom me-2"></i>
                            {lesson.title}
                            {!!lesson.is_preview && (
                              <span className="badge text-bg-light text-primary-custom ms-2">Preview</span>
                            )}
                          </span>
                          {lesson.duration_minutes ? (
                            <span className="text-muted small">{lesson.duration_minutes} min</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted mb-0">Curriculum details will be available soon.</p>
      ),
    },
    {
      key: "instructor",
      label: "Instructor",
      children: hasTeacher ? (
        <div className="d-flex flex-column flex-sm-row gap-4 align-items-start">
          <img
            src={course.teacher_photo || PLACEHOLDER}
            alt={course.teacher_name}
            className="rounded-custom"
            width={120}
            height={120}
            style={{ objectFit: "cover" }}
          />
          <div>
            <h5 className="font-heading mb-1">{course.teacher_name}</h5>
            {course.teacher_designation && (
              <p className="text-primary-custom fw-medium mb-2">{course.teacher_designation}</p>
            )}
            {course.teacher_bio && <p className="text-muted">{course.teacher_bio}</p>}
            <Link href={`/teachers/${course.teacher_id}`} className="btn btn-outline-primary rounded-pill px-4">
              View Full Profile
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-muted">Instructor details coming soon.</p>
      ),
    },
    {
      key: "reviews",
      label: "Reviews",
      children: (
        <div className="d-flex flex-column gap-4">
          {testimonials.slice(0, 2).map((t) => (
            <div className="d-flex gap-3" key={t.id}>
              <img src={t.photo} alt={t.name} className="rounded-circle" width={48} height={48} />
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h6 className="mb-0">{t.name}</h6>
                  <Rate disabled defaultValue={t.rating} style={{ fontSize: 14 }} />
                </div>
                <p className="text-muted small mb-0">{t.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Page Header */}
      <section className="hero-section">
        <div className="container py-5">
          <span className={`badge badge-level text-bg-${levelColors[course.level] || "secondary"} text-capitalize mb-2`}>
            {course.level}
          </span>
          <h1 className="font-heading mb-2">{course.course_name}</h1>
          <p className="text-white-50 mb-2">{course.short_description}</p>
          <div className="d-flex flex-wrap gap-4 text-white-50 small">
            <span><i className="bi bi-person-circle me-1"></i>{course.teacher_name || "Vidyaan Faculty"}</span>
            {course.duration && <span><i className="bi bi-clock me-1"></i>{course.duration}</span>}
            {course.category_name && <span><i className="bi bi-grid me-1"></i>{course.category_name}</span>}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <img
                src={course.thumbnail || PLACEHOLDER}
                alt={course.course_name}
                className="img-fluid rounded-custom mb-4 w-100"
                style={{ maxHeight: 360, objectFit: "cover" }}
              />
              <Tabs defaultActiveKey="overview" items={tabItems} />
            </div>

            <div className="col-lg-4">
              <div className="card card-custom border-0 p-4" style={{ position: "sticky", top: 100 }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  {hasDiscount ? (
                    <>
                      <h3 className="font-heading text-primary-custom mb-0">₹{course.discount_price}</h3>
                      <span className="text-muted text-decoration-line-through">₹{course.price}</span>
                    </>
                  ) : (
                    <h3 className="font-heading text-primary-custom mb-0">₹{course.price}</h3>
                  )}
                </div>
                {/* Buy Now - disabled until Razorpay payment gateway is integrated
                <button type="button" className="btn btn-accent btn-lg w-100 rounded-pill mb-2" disabled>
                  Buy Now
                </button>
                <p className="text-center text-muted small mb-4">
                  Secure checkout powered by Razorpay (coming soon)
                </p>
                */}

                {!user ? (
                  <>
                    <Link
                      href={`/login?redirect=/courses/${course.slug}`}
                      className="btn btn-accent btn-lg w-100 rounded-pill mb-2"
                    >
                      Login to Enroll
                    </Link>
                    <p className="text-center text-muted small mb-4">
                      Don&apos;t have an account?{" "}
                      <Link href={`/register?redirect=/courses/${course.slug}`} className="text-primary-custom fw-medium">
                        Register
                      </Link>{" "}
                      to enroll in this course.
                    </p>
                  </>
                ) : user.role !== "student" ? (
                  <p className="text-center text-muted small mb-4">
                    Enrollment is available for student accounts only.
                  </p>
                ) : enrollment ? (
                  <>
                    <button type="button" className="btn btn-success btn-lg w-100 rounded-pill mb-2" disabled>
                      <i className="bi bi-check-circle-fill me-2"></i>Enrolled
                    </button>
                    <p className="text-center text-muted small mb-4">
                      You are enrolled in this course.
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-accent btn-lg w-100 rounded-pill mb-2"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? "Enrolling..." : "Enroll Now"}
                    </button>
                    <p className="text-center text-muted small mb-4">
                      Payments coming soon &mdash; enroll for free for now.
                    </p>
                  </>
                )}
                <h6 className="font-heading mb-3">This course includes:</h6>
                <ul className="list-unstyled d-flex flex-column gap-2 text-muted small mb-0">
                  {course.duration && (
                    <li><i className="bi bi-clock text-primary-custom me-2"></i>{course.duration} of content</li>
                  )}
                  <li><i className="bi bi-bar-chart text-primary-custom me-2"></i>Level: <span className="text-capitalize">{course.level}</span></li>
                  <li><i className="bi bi-file-earmark-text text-primary-custom me-2"></i>Downloadable resources</li>
                  <li><i className="bi bi-patch-check text-primary-custom me-2"></i>Certificate of completion</li>
                  <li><i className="bi bi-infinity text-primary-custom me-2"></i>Full lifetime access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
